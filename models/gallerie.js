
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var gallerieSchema = mongoose.Schema({
        idAuteur : String,
        nom: String,
        date: { type: Date, default: Date.now }        
 });

 gallerieSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Gallerie', gallerieSchema);