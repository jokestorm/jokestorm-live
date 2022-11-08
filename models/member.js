const mongoose = require('mongoose');
const Review = require('./review');
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
});

// Mongoose middleware, hook into findOneAndDelete, delete reviews from the member if they are found
MemberSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany( {
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Member', MemberSchema);