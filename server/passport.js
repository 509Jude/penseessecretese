// load passport module
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var User = require('../models/user');

module.exports = function(passport) {
    // passport init setup
    // serialize the user for the session
    passport.serializeUser(function(user, done) {
    done(null, user.id);
    });
    // deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        done(err, user);
        });
    });
    // using local strategy
    passport.use('local-login', new LocalStrategy({
    // change default username and password, to email
    //and password
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    },
    function(req, email, password, done) {
    if (email)
    // format to lower-case
    email = email.toLowerCase();
    // process asynchronous
        process.nextTick(function() {
            User.findOne({ 'email' : email },
            function(err, user)
            {
            // if errors
            if (err)
            return done(err);
            // check errors and bring the messages
            if (!user)
            return done(null, false, req.flash('loginMessage',
            'Utilisateur inexistant.'));
            if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage',
            'Wohh! Mauvais mot de passe.'));
            // everything ok, get user
            else
                return done(null, user);
            });
        });
    }));

    // Signup local strategy
 passport.use('local-signup', new LocalStrategy({
    // change default username and password, to email and
    // password
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    },
    function(req, email, password, done) {
    if (email)
    // format to lower-case
    email = email.toLowerCase();
    // asynchronous
    process.nextTick(function() {
    // if the user is not already logged in:
    if (!req.user) {
    User.findOne({ 'email' : email },
    function(err,user) {
        // if errors
        if (err)
        return done(err);
        // check email
        if (user) {
        return done(null, false, req.flash('signupMessage',
        'Wohh! Cet email existe deja.'));
        }
            else {
                // create the user
                var newUser = new User();
                // Get user name from req.body
                newUser.nom = req.body.nom;
                newUser.prenom = req.body.prenom;
                newUser.email = email;
                newUser.password =
                newUser.generateHash(password);
                // save data
                newUser.save(function(err) {
                if (err)
                    throw err;
                    return done(null, newUser);
                });
            }
        });
    } else {
        return done(null, req.user);
    } 
});
    }));
 };
   