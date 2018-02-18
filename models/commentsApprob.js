var mongoose = require('mongoose');

var commentsApprobSchema = mongoose.Schema({
        idArticle:String,
        contenu:String,
        nom:String,
        prenom:String,
        date: { type: Date, default: Date.now }   
 });

module.exports = mongoose.model('CommentsApprob', commentsApprobSchema);