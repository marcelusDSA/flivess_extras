/**
 * Created by Joe on 26/5/16.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;
//var user = require('../models/user.js');
var user = mongoose.model('User');
//var notification = require('../models/notification.js');


var notificationSchema = new Schema({
    username: {type: String},
    actionusername: {type: String},
    text: {type: String},
    type: {type: Number},
    date: {type: Date, default: Date.now},
    vist: Boolean
});

//types
// 0 = some user send you a message
// 1 = some user follow you
// 2 = some friend save a track

//vist true-->vist false-->encara no vist
module.exports = mongoose.model('notification', notificationSchema);