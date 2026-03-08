import MilkEntry from '../models/MilkEntry.js';

const getMonthRange = (year, month) => {
  const start = new Date(year, month - 1, 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(year, month, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getMonthlySummary = async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res
      .status(400)
      .json({ message: 'month and year are required for summary' });
  }
  const monthNum = Number(month);
  const yearNum = Number(year);
  const { start, end } = getMonthRange(yearNum, monthNum);

  const summary = await MilkEntry.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        totalMorning: { $sum: '$morning' },
        totalEvening: { $sum: '$evening' },
        daysWithData: {
          $addToSet: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          }
        }
      }
    },
    {
      $project: {
        totalMorning: 1,
        totalEvening: 1,
        daysCount: { $size: '$daysWithData' }
      }
    }
  ]);

  const totals = summary[0] || {
    totalMorning: 0,
    totalEvening: 0,
    daysCount: 0
  };
  const totalMorning = totals.totalMorning || 0;
  const totalEvening = totals.totalEvening || 0;
  const totalMilk = totalMorning + totalEvening;
  const daysCount = totals.daysCount || 1;
  const pricePerLiter = 80;
  const totalRevenue = totalMilk * pricePerLiter;

  const avgMorningPerDay = totalMorning / daysCount;
  const avgEveningPerDay = totalEvening / daysCount;
  const avgTotalPerDay = totalMilk / daysCount;

  res.json({
    month: monthNum,
    year: yearNum,
    totalMorning,
    totalEvening,
    totalMilk,
    daysCount,
    avgMorningPerDay,
    avgEveningPerDay,
    avgTotalPerDay,
    pricePerLiter,
    totalRevenue
  });
};

