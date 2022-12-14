const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
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

// Mongoose middleware, hook into findOneAndDelete, delete reviews from the post if they are found
PostSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Post', PostSchema);