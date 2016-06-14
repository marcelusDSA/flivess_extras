var mongoose = require('mongoose');
Schema   = mongoose.Schema;
var User = mongoose.model('User');

var RequestSchema = new Schema({
    username:    { type: String },
    request: { type: Schema.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Request', RequestSchema);
