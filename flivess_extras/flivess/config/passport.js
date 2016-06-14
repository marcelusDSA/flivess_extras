// config/passport.js
module.exports = function(passport) {
    var mongoose = require('mongoose');
    // load up the user model
    var User = require('../models/user.js');
    // load all the things we need
    var FacebookStrategy = require('passport-facebook').Strategy;
    // load the auth variables
    var configAuth = require('./auth');


    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: configAuth.facebookAuth.profileFields

        },

        // facebook will send back the token and profile
        function (req, refreshToken, profile, done) {
            console.log("1");
            // asynchronous
            console.log(profile._json.id);
            process.nextTick(function () {
                //find the user in the database based on their facebook id
                if (!req.user) {
                    User.findOne({facebook_id: profile._json.id}, function (err, user) {

                        if (user==null) {
                            User.findOne({username: profile._json.name}, function (err, user) {

                                var newUser = new User();

                                newUser.facebook_id = profile._json.id;
                                if (user == null) newUser.username = profile._json.name;
                                else newUser.username = profile._json.id;
                                newUser.fullname = profile._json.name;
                                newUser.email = profile.emails[0].value;
                                newUser.imgurl = 'http://graph.facebook.com/' + profile._json.id + '/picture?width=270&height=270';

                                newUser.save(function (err) {
                                    if (err)
                                        return done(err);

                                    return done(null, newUser);
                                });
                            });
                        }
                        else return done(null, user);
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.facebook_id = profile._json.id;
                    user.username = profile._json.name;
                    user.fullname = profile._json.name;
                    user.email = profile._json.email;

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });
                }
            });
        }));
};



