import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

let RuleSchema = new mongoose.Schema({
  betails: {
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

RuleSchema.plugin(AutoIncrement, { inc_field: 'rule_id' });

let Rule = mongoose.model('Rule', RuleSchema);

export default Rule;
