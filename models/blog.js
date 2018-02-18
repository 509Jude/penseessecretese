
var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
        titre: String       
 });

module.exports = mongoose.model('Blog', blogSchema);