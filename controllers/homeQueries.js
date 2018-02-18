let User = require('../models/user');
let Rubrique = require('../models/rubrique');
let Blog = require('../models/blog');
let Articles = require('../models/articles');


exports.afficherRubriques = (cb)=>{
    Rubrique.find({}, (err,r)=>{
        if(err)
            console.log(err);      
        return cb(r);
    })
};

exports.afficherArticle = (id, cb) => {
    Articles.findById(id, (err, r)=>{
        if(err){
            console.log(err)
        }

        cb(r)
    })
}