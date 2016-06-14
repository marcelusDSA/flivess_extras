module.exports = function (app) {
    var mongoose = require('mongoose');
    var User = require('../models/user.js');

    //var base_url = "http://147.83.7.157:8080";
    var base_url = "http://localhost:8080";
    //GET - GET All Users By Into DB
    AllUsers = function (req, res) {
        User.find(function (err, users) {
            if (err) res.send(500, err.message);

            console.log('GET /users')
            res.status(200).json(users);
        });
    };

    //GET - GET All Users With Friends
    AllUsersWithFriends = function (req, res) {
        User.find({})
               .populate('friend')
               .exec(function(error, users) {
                console.log(JSON.stringify(users, null, "\t"));
               })

    };

    //GET - Return a User with specified ID
    findById = function (req, res) {
        User.findById(req.params.id, function (err, users) {
            if (err) return res.send(500, err.message);

            console.log('GET /user/' + req.params.id);
            res.status(200).json(users);
        });
    };

    //GET - Return a user with a specified name
    findbyName = function (req,res) {
        User.find({username:req.params.username}, function (err,user){
            if (err) return res.send(500, err.message);
            console.log("busco a"+ req.params.username);
            res.status(200).json(user);
        })
    }

    //GET - Return a user with a specified facebook_id
    findbyFacebookid = function (req,res) {
        User.find({facebook_id: req.params.facebook_id}, function (err,user){
            if (err) return res.send(500, err.message);
            console.log("busco a"+ req.params.facebook_id);
            res.status(200).json(user);
        })
    }

    //POST - Add User 
        addUser = function (req, res) {
        console.log('POST');
        console.log(req.body);
        result = res;
        request = req;

        var u = [];
        var u1;
        var u2;


       var username = req.body.username;

        
        User.findOne({username: username}, function (err, user) {
            console.log (user);


            if (user == null) {
                u1 = req.body.username;
                console.log(u1 + u2 );
                checkregister(u1, u2);
            }
            else {

                //var user = JSON.stringify(user);
                //var res = user.split(",");
                //console.log("aqui el res esta con el split"+res);
               // console.log(user.username);
               // u = res[3].split(":");
               // console.log(u);
                u2 = user.username;
                u1 = req.body.username;
                checkregister(u1, u2);
            }
            

        });

    };

    function checkregister(u1, u2) {
        console.log("CHECK REGISTER");
        console.log("U1: "+u1);
        console.log("U2: "+u2);

        if (u1 == u2) {
            return result.status(409).json("usuario " + u1 + " ya existe");
        }
        else {
            console.log("he comprobado que no existe")
            var imgurl;
            if(request.body.imgurl == null)
            {
                imgurl = base_url + '/img/default-image.png'
            }
            else imgurl =  request.body.imgurl;


                var users = new User({
                    username: request.body.username,
                    fullname: request.body.fullname,
                    email: request.body.email,
                    password: request.body.password,
                    imgurl: imgurl,
                    age: request.body.age,
                    sex:request.body.sex,
                    city:request.body.city,
                    weight:request.body.weight,
                    height:request.body.height,
                    facebook_id:request.body.facebook_id,

                })
            console.log(users);

            users.save(function (err, users) {
                if (err) {
                    console.log('ERROR');
                    console.log(err);
                    return result.send(500, err.message);
                }

                result.status(200).json(users);

            });
        }
    };



    //PUT - Update a register already exists
    updateUser = function (req, res) {
        User.findById(req.params.id, function (err, users) {
            console.log('PUT');
            console.log(req.params.id);
            console.log(req.body);
        

            users.username = req.body.username;
            users.fullname = req.body.fullname;
            users.email = req.body.email;
            users.password = req.body.password;
            users.age = req.body.age;
            users.sex = req.body.sex;
            users.city = req.body.city;
            users.weight = req.body.weight;
            users.height = req.body.height;
            users.imgurl= req.body.imgurl;

            users.save(function (err) {
                if (err) return res.send(500, err.message);
                res.status(200).json(users);
            });
        });
    };

    //PUT - Update a register already exists
    updateUserFacebook = function (req, res) {
        User.findById(req.params.id, function (err, users) {
            console.log('PUT');
            console.log(req.params.id);
            console.log(req.body);


            users.username = req.body.username;
            users.fullname = req.body.fullname;
            users.email = req.body.email;
            users.imgurl= req.body.imgurl;

            users.save(function (err) {
                if (err) return res.send(500, err.message);
                res.status(200).json(users);
            });
        });
    };


    //DELETE - Delete a User with specified ID
    deleteUser = function (req, res) {
        return User.findOne(req.params.username, function (err, users) {
            console.log('DELETE usuario');
            return users.remove(function (err) {
                if (!err) {
                    console.log("usuario eliminado");
                    return res.send('');
                } else {
                    console.log(err);
                }
            });
        });
    }


    getJson = function (req,res) {
        var fs = require('fs');
        fs.writeFile("test",JSON.stringify(req.body),function(err){
            return console.log(err);
        })
        console.log('OK');
        console.log(req.body);
        res.send('OKS!');
    }

    var username;
    var fs = require('fs');// file system module help to add file at server.
    // path = require("path");
    var formidable = require('formidable');
    var filename;
    var imagen;

    //PUT- upload img
    addImg = function (req, res) {

        var form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
            console.log("LOS FICHEROOOOOS");
            console.log(files.file);
            var tmp_path = files.file.path; // file is the name html input that contain us route img
            var tipo = files.file.type; // type file

            if (tipo == 'image/png' || tipo == 'image/jpg' || tipo == 'image/jpeg') {
                // if you want to add others file type just tipo == 'image/jpeg' change for example .pdf   application/pdf
                // you will find all mimes here http://www.marcelopedra.com.ar/blog/2011/05/12/listado-de-tipos-mime/

                var aleatorio = Math.floor((Math.random() * 9999) + 1);//random  variable
                filename = aleatorio + "" + files.file.name;//name file and random variable

                var target_path = './public/img/' + filename;// route to add us file and concatenate filename
                fs.rename(tmp_path, target_path, function (err) {//we write the file
                    fs.unlink(tmp_path, function (err) {


                        console.log("antes de enviar la confirmacion al cliente");

                        console.log('<p>added photo </p></br><img  src="./img/' + filename + '"/>'); // responde to costomer
                    });

                });

                var usern = req.params.username;
                User.findOne({username: usern}, function (err, user) {
                    imagen = base_url + "/img/" + filename;
                    console.log ("user: " + user);
                    user.imgurl = imagen;

                    user.save(function (err) {
                        if (err) return res.send(500, err.message);
                        res.status(200).jsonp(user);
                    });
                });

            } else {
                console.log('file format is not allow');
            }

            if (err) {
                console.error(err.message);

                return;
            }


        });

    };





    //endpoints
    app.get('/allusers/',AllUsers);
    app.post('/user/', addUser);
    app.put('/addimg/:username', addImg);
    app.get('/user/:id', findById);
    app.get('/users/user/:username',findbyName);
    app.get('/users/user/facebook/:facebook_id',findbyFacebookid);
    app.put('/user/:id', updateUser);
    app.put('/user_facebook/:id', updateUserFacebook);
    //app.post('/data/',getJson);
    app.delete('/user/:username', deleteUser);
}
