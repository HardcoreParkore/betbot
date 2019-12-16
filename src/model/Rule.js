import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

let RuleSchema = new mongoose.Schema({
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
  sender: {
    type: String,
    default: 'Unknown'
  },
  metadata: {
    type: Map
  }
});

RuleSchema.plugin(AutoIncrement, { inc_field: 'id' });

let Rule = mongoose.model('Rule', RuleSchema);

export default Rule;
