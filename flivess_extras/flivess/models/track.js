/**
 * Created by Joe on 7/5/16.
 */
var mongoose = require('mongoose');
Schema   = mongoose.Schema;



var trackSchema = new Schema({
        title:              { type: String},
        username:           { type: String},
        pointsurl:          { type: String},
        distance:           { type: Number},
        avg_speed:          { type: Number},
        time:               { type: Number},
        id_comun:           { type: String},
        created:            { type: Date, default: Date.now}
    },
    {
        versionKey: false // You should be aware of the outcome after set to false (elimina __V)
    });

module.exports = mongoose.model('Track', trackSchema);