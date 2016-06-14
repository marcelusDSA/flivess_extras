var mongoose = require('mongoose');
    Schema   = mongoose.Schema;



var userSchema = new Schema({
    facebook_id:        { type: String},
    username:           { type: String},
    fullname:           { type: String},
    email:              { type: String},
    password:           { type: String},
    imgurl:             { type: String},
    city:               { type: String},
    age:                { type: String},
    sex:                { type: String},
    weight:             { type: String},
    height:             { type: String},
    created:            { type: Date, default: Date.now},
    requests:   [{type: Schema.ObjectId, ref: "User"}],
    friends:   [{type: Schema.ObjectId, ref: "User"}]
    },

    {
    versionKey: false // You should be aware of the outcome after set to false (elimina __V)
});

module.exports = mongoose.model('User', userSchema);
