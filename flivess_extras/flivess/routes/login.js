/**
 * Created by Joe on 16/4/16.
 */
module.exports = function (app) {
    var mongoose = require('mongoose');
    var User = require('../models/user.js');

    //POST
    login =function(req,res){

        User.findOne({username: req.body.username, password: req.body.password}, function(err,user){
            if(user==null) return res.status(404).send("INCORRECTO");
            else {
                return res.status(200).send(user);
            }
        });
    };


    //ENPOINTS
    app.post('/login',login);
}