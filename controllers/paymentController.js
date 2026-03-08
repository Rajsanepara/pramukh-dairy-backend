import Payment from '../models/Payment.js';

export const upsertPaymentStatus = async (req, res) => {
  const { clientId, month, year, status, totalLiters, totalAmount } = req.body;

  if (!clientId || !month || !year || !status) {
    return res
      .status(400)
      .json({ message: 'clientId, month, year and status are required' });
  }

  const doc = await Payment.findOneAndUpdate(
    { client: clientId, month, year },
    {
      client: clientId,
      month,
      year,
      status,
      totalLiters,
      totalAmount,
      paidAt: status === 'Paid' ? new Date() : null
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json(doc);
};

export const getPaymentStatus = async (req, res) => {
  const { clientId, month, year } = req.query;
  if (!clientId || !month || !year) {
    return res
      .status(400)
      .json({ message: 'clientId, month and year are required' });
  }

  const payment = await Payment.findOne({
    client: clientId,
    month: Number(month),
    year: Number(year)
  }).lean();

  res.json(payment || { status: 'Pending' });
};

