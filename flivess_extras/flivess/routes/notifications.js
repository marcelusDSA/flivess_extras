/**
 * Created by Joe on 26/5/16.
 */
var notification = require('../models/notification.js');
//var jwtoken = require('../config/jwtauth.js');
var mongoose = require('mongoose');
module.exports = function (app) {


    getNotifications = function(req,res){

            notification.find({username: req.params.username}).exec(function(err, notify) {

                res.send(notify);
            });
    };

    getNotificationsType = function(req,res){
        var pages;
        if (req.params.page == undefined)
            res.status(400).send("Page needed");
        else{
            notification.find({username: req.params.username, type: req.params.type}).exec(function(err, notify){
                if(err) {
                    res.status(500).send(err);
                }
                else pages=notify.length;
            })
            notification.find({username: req.params.username, type: req.params.type}).sort({date:-1}).skip(req.params.page).limit(5).exec(function(err, notify){
                if(err) {
                    res.status(500).send(err);
                }
                else {
                    console.log(notify);
                    res.send({data: notify, pages: pages});
                }
            })
        }
    };
    deleteNotification = function(req, res){
        if (req.params.id == undefined)
            res.status(400).send("Id needed");
        else{
            notification.findOne({_id: req.params.id}).exec(function(err, notify){
                if(err) {
                    res.status(500).send(err);
                }else if(notify==undefined){
                    res.status(404).send("Notification doesn't exist.")
                }
                else {
                    notify.remove(function(err){
                            if(err) res.status(500).send(err);
                            else res.send("Deleted");
                        }
                    )
                }
            })
        }
    };
    deleteall=function(req,res) {

        notification.find({username: req.params.username}).exec(function (err, notify) {
            if (err) {
                res.status(500).send(err);
            } else if (notify == undefined) {
                res.status(404).send("Notification doesn't exist.")
            }
            else {
                for (var i = 0; i < notify.length; i++) {
                    notify[i].remove(function (err) {
                            if (err) res.status(500).send(err);
                        }
                    )
                }
                ;
                res.send("Deleted");
            }
        })

    };
    deletethis=function(req,res) {

        notification.find({username: req.params.username}).skip(req.params.page).limit(5).sort({date: -1}).exec(function (err, notify) {
            console.log("Gol de Villa");
            if (err) {
                res.status(500).send(err);
            } else if (notify == undefined) {
                res.status(404).send("Notification doesn't exist.")
            }
            else {
                console.log("Aqui");
                console.log(notify[0]);
                for (var i = 0; i < notify.length; i++) {
                    notify[i].remove(function (err) {
                            if (err) res.status(500).send(err);
                        }
                    )
                }
                res.send("Deleted");
            }
        });

    };


    vistTot = function (req,res) {
        notification.find({username: req.params.username}, function (err,notis){

            console.log(notis);
            for(var i=0; i<notis.length; i++)
            {
                notis[i].vist = true;
                notis[i].save();
            }
            res.status(200);
            /*notis.save(function (err) {
                if (err) return res.send(500, err.message);
                res.status(200).json(notis);
            });*/
        });
    };

    app.get('/notifications/user/:username',getNotifications);
    app.get('/notifications/users/user/:username/type=:type/page=:page',getNotificationsType);
    app.delete('/notifications/:id',deleteNotification);
    app.delete('/notifications/:username/all',deleteall);
    app.delete('/notifications/delete/:username/page=:page',deletethis);
    app.put('/notifications/saw/:username', vistTot);
};