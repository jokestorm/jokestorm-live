const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    handle: { type: String, required: true },
    email: String,
    idle: {
        currentScore: Number,
        highScore: Number
    },
    hash: String,
    salt: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Member', MemberSchema);