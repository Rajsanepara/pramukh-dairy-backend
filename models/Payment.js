import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    },
    totalLiters: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending'
    },
    paidAt: {
      type: Date
    }
  },
  { timestamps: true }
);

paymentSchema.index({ client: 1, month: 1, year: 1 }, { unique: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

