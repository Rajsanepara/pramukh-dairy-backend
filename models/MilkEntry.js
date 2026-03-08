import mongoose from 'mongoose';

const milkEntrySchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    morning: {
      type: Number,
      default: 0
    },
    evening: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

milkEntrySchema.index({ client: 1, date: 1 }, { unique: true });

milkEntrySchema.virtual('total').get(function total() {
  return (this.morning || 0) + (this.evening || 0);
});

const MilkEntry = mongoose.model('MilkEntry', milkEntrySchema);

export default MilkEntry;