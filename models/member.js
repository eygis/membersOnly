let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    membership_status: {type: Boolean},
    admin_status: {type: Boolean}
})

module.exports = mongoose.model('User', userSchema);