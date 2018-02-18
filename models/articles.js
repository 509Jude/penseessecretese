var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');


var articlesSchema = mongoose.Schema({
        idAuteur:String,
        nomAuteur : String,
        prenomAuteur : String,
        bioAuteur : String,
        photoAuteur : String,
        titre:String,
        categorie:String,
        contenu:String,
        image : String,
        date: { type: Date, default: Date.now }  
 });

 articlesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Articles', articlesSchema);