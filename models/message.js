let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
    title: {type: String, required: true, maxLength: 100},
    timestamp: {type: Date, required: true},
    message: {type: String, required: true, maxLength: 100},
    author: {type: String, required: true, maxLength: 100}
})

module.exports = mongoose.model('Message', messageSchema);