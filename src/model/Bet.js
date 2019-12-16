import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
  },
  senderUserName: {
    type: String
  },
  senderUserId: {
    type: String
  },
  metadata: {
    type: Map
  }
});

BetSchema.plugin(AutoIncrement, { inc_field: 'id' });

let Bet = mongoose.model('Bet', BetSchema);

export default Bet;
