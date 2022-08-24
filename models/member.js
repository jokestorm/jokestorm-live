const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    handle: String,
    email: String,
    hash: String,
    salt: String
})

module.exports = mongoose.model('Member', MemberSchema);