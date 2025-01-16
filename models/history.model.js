import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  pointsClaimed: {
    type: Number,
    required: true,
  },
  claimedAt: {
    type: Date,
    default: Date.now, 
  },
});

const History = mongoose.model('History', historySchema);

export default History;
