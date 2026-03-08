import MilkEntry from '../models/MilkEntry.js';
import Client from '../models/Client.js';
import Payment from '../models/Payment.js';

// Helper to get start and end dates for a month
const getMonthRange = (year, month) => {
  const start = new Date(year, month - 1, 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(year, month, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getClientMonthlyBill = async (req, res) => {
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

  const client = await Client.findById(clientId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const entries = await MilkEntry.find({
    client: clientId,
    date: { $gte: start, $lte: end }
  })
    .sort({ date: 1 })
    .lean();

  let totalLiters = 0;
  const rows = entries.map((e) => {
    const total = (e.morning || 0) + (e.evening || 0);
    totalLiters += total;
    return {
      date: e.date,
      morning: e.morning || 0,
      evening: e.evening || 0,
      total
    };
  });

  const rate = client.ratePerLiter || 80;
  const totalAmount = totalLiters * rate;

  const payment = await Payment.findOne({
    client: clientId,
    month: monthNum,
    year: yearNum
  }).lean();

  res.json({
    client: {
      id: client._id,
      name: client.name,
      phone: client.phone,
      ratePerLiter: rate
    },
    month: monthNum,
    year: yearNum,
    rows,
    totalLiters,
    ratePerLiter: rate,
    totalAmount,
    paymentStatus: payment?.status || 'Pending'
  });
};

