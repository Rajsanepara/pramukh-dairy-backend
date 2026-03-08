import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    ratePerLiter: {
      type: Number,
      default: 80
    }
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

export default Client;