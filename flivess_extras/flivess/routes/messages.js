module.exports = function (app) {

    var User = require('../models/user.js');
    var Message = require('../models/message.js');
    var notification = require('../models/notification.js');

    getMessagesByUser = function(req,res) {


        console.log("getuserbymessage\n");
        console.log(req.params.username);
        console.log(req.params.sender);


        console.log("IDS GET");
        Message.find({
            $or: [{receiver: req.params.username, sender: req.params.sender}, {
                receiver: req.params.sender,
                sender: req.params.username
            }]
        }, function (err, message) {
            console.log(message);
            User.populate(message, {path: "sender"}, function (err, m) {
                res.status(200).send(message);
            });
        });
    };
    

    //GET - GET all messages
    allMessages = function (req, res) {

        console.log("ok populate");
        Message.find({}, function(err, message) {

             console.log("ok populate");
             console.log(message);
            User.populate(message, {path: "sender"},function(err, message){
            res.status(200).send(message);

            console.log(message);
            }); 
         });
    };


    //POST - POST Message By User
    addMessage = function (req, res) {
        console.log('POST');
        console.log(req.body);
        User.findOne({username: req.body.username}, function (err) {
            if (err) {
                res.send(401, err.message);
            }
            else {
                var message = new Message({
                    receiver: req.body.receiver,
                    sender: req.body.sender,
                    text: req.body.text
                });
                message.save(function (err, message) {
                    if (err) return res.send(500, err.message);
                    res.status(200).json(message);
                });

                console.log('CREO LA NOTIFICACION');
                var notify = new notification({
                    username: req.body.receiver,
                    type: 0,
                    actionusername: req.body.sender,
                    text: "send you a message",
                    vist: false
                });
                notify.save(function (err) {
                    if (err)res.status(500).send('Internal server error');
                })
            }
        });
    };

    //GET - get users that wrotes a determinate user
    findMessages = function (req, res) {
        var arr1;
        var arr2;
        console.log(req.params.username);
        Message.find({receiver: req.params.username}).distinct("sender", function (err, message) {

                arr1 = message;
                //res.status(200).send(m);
                console.log(arr1);



                    Message.find({sender: req.params.username}).distinct("receiver", function (err, message2) {
                        console.log("MENSAJE2:"+message2);

                            arr2= message2;
                            var result = arr1.concat(arr2);
                            console.log(result);
                            var mySet = new Set(result);
                            var final = Array.from(mySet);
                            console.log(final);
                            console.log(mySet);
                            User.find({username: {$in:final }}, function(err,users){
                                console.log("USUARIOS:"+users);
                                res.status(200).send(users);
                            });


                    });

        });

};


    
    //DELETE - Delete a User with specified ID
    deleteMessage = function (req, res) {
        return Message.findById(req.params.id, function (err, message) {
            console.log('DELETE usuario');
            return message.remove(function (err) {
                if (!err) {
                    console.log("usuario eliminado");
                    return res.send('');
                } else {
                    console.log(err);
                }
            });
        });
    };

  
    //Endpoints
    app.get('/allmessages', allMessages);
    app.get('/messages/:username/:sender',getMessagesByUser);
    app.post('/addmessage', addMessage);
    app.get('/messages/:username', findMessages);
    app.delete('/message/:id', deleteMessage);


}
