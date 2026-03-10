import MilkEntry from '../models/MilkEntry.js';
import Client from '../models/Client.js';

const normalizeDate = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getMonthRange = (year, month) => {
  const start = new Date(year, month - 1, 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(year, month, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// Get milk entries for a given date, along with all clients
export const getDailyMilk = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'date is required (YYYY-MM-DD)' });
  }
  const day = normalizeDate(date);

  const [clients, entries] = await Promise.all([
    Client.find().sort({ name: 1 }),
    MilkEntry.find({ date: day }).lean()
  ]);

  const entryMap = new Map();
  entries.forEach((e) => {
    entryMap.set(e.client.toString(), e);
  });

  const result = clients.map((c) => {
    const entry = entryMap.get(c._id.toString());
    return {
      clientId: c._id,
      name: c.name,
      phone: c.phone,
      isActive: c.isActive,
      morning: entry?.morning || 0,
      evening: entry?.evening || 0
    };
  });

  res.json({ date: day, items: result });
};

// Upsert a single milk value for a client/date/session (morning/evening)
export const upsertMilkEntry = async (req, res) => {
  const { clientId, date, session, value } = req.body;

  if (!clientId || !date || !session) {
    return res
      .status(400)
      .json({ message: 'clientId, date and session are required' });
  }
  if (!['morning', 'evening'].includes(session)) {
    return res.status(400).json({ message: 'session must be morning or evening' });
  }

  const day = normalizeDate(date);

  const update = {};
  update[session] = value ?? 0;

  const entry = await MilkEntry.findOneAndUpdate(
    { client: clientId, date: day },
    { $set: update, client: clientId, date: day },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json(entry);
};

// Get full month milk entries for a single client (customer-wise monthly editing)
export const getClientMonthlyMilk = async (req, res) => {
  const { clientId } = req.params;
  const { month, year } = req.query;

  if (!clientId || !month || !year) {
    return res
      .status(400)
      .json({ message: 'clientId, month and year are required' });
  }

  const monthNum = Number(month);
  const yearNum = Number(year);
  const { start, end } = getMonthRange(yearNum, monthNum);

  const client = await Client.findById(clientId).lean();
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const entries = await MilkEntry.find({
    client: clientId,
    date: { $gte: start, $lte: end }
  })
    .sort({ date: 1 })
    .lean();

  const entryByDay = new Map();
  entries.forEach((e) => {
    const d = new Date(e.date);
    const dayOfMonth = d.getDate();
    entryByDay.set(dayOfMonth, e);
  });

  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  const days = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const entry = entryByDay.get(day);
    const morning = entry?.morning || 0;
    const evening = entry?.evening || 0;
    const mm = String(monthNum).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${yearNum}-${mm}-${dd}`;

    days.push({
      day,
      date: dateStr,
      morning,
      evening,
      total: morning + evening
    });
  }

  res.json({
    client: {
      id: client._id,
      name: client.name,
      phone: client.phone,
      isActive: client.isActive
    },
    month: monthNum,
    year: yearNum,
    days
  });
};

