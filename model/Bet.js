import mongoose from 'mongoose';
var ObjectId = mongoose.Schema.Types.ObjectId;

let BetSchema = new mongoose.Schema({
    details: {
        type: String
    },
    objId: {
        type: ObjectId
    }
});
let Bet = mongoose.model('Bet', BetSchema);

export default Bet;

