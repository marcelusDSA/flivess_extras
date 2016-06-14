/**
 * Created by aitor on 29/4/16.
 */
module.exports = function(app, passport) {

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook') ,
        function(req, res) {
            console.log("EL REQ");
            console.log(req.user);
            // If this function gets called, authentication was successful.
            // `req.user` contains the authenticated user.
            if (req.user.username!=req.user.facebook_id) res.redirect('/#/home/' + req.user.facebook_id);
            else res.redirect('/#/edit/' + req.user.facebook_id);
        });


};