const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const MemeSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// Mongoose middleware, hook into findOneAndDelete, delete reviews from the meme if they are found
MemeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Meme', MemeSchema);