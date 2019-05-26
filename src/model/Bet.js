import mongoose from 'mongoose';
var ObjectId = mongoose.Schema.Types.ObjectId;

let BetSchema = new mongoose.Schema({
  details: {
    type: String,
    required: true
  },
  id: {
    type: Number
  },
  status: {
    type: String,
    default: 'ACTIVE'
  }
});

let Bet = mongoose.model('Bet', BetSchema);

export default Bet;
