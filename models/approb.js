
var mongoose = require('mongoose');

var approbationSchema = mongoose.Schema({
        idAuteur:String,
        nomAuteur : String,
        prenomAuteur : String,
        titre:String,
        categorie:String,
        contenu:String,
        image : String,
        date: { type: Date, default: Date.now }  
 });

module.exports = mongoose.model('Approbation', approbationSchema);