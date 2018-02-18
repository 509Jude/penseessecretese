// Import Mongoose and password Encrypt
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// define the schema for User model
var userSchema = mongoose.Schema({
        // Using local for Local Strategy Passport
        nom: String,
        prenom: String,
        email: String,
        password: String,
        photo : {type: String, default: 'default.png'},
        role: {type: String, default: 'admin'},
        bio: {type: String, default: 'Ajouter une bio.'},
        allow:{type: Boolean, default: false}

        
 });
// Encrypt Password
userSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// Verify if password is valid
userSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.password);
};
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);