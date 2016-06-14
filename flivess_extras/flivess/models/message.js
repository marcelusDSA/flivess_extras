var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
    var User = mongoose.model('User');

var messageSchema = new Schema({
	
    receiver:    { type: String},
    text :  {type: String},
    createdAt: {type: Date, default: Date.now},
    sender: { type: String },
     }, {
    versionKey: false // You should be aware of the outcome after set to false (elimina __V)
});
module.exports = mongoose.model("Message", messageSchema);