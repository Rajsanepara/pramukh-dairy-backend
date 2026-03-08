import MilkEntry from '../models/MilkEntry.js';
import Client from '../models/Client.js';

const normalizeDate = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
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

