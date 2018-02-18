
var mongoose = require('mongoose');

var rubriqueSchema = mongoose.Schema({
        titre: String       
 });

module.exports = mongoose.model('Rubrique', rubriqueSchema);