let User = require('../models/user');
let Rubrique = require('../models/rubrique');
let Blog = require('../models/blog');
let Approb = require('../models/approb');
let commentsApprob = require('../models/commentsApprob');
let Articles = require('../models/articles');
let Gallerie = require('../models/gallerie');
var bcrypt = require('bcrypt-nodejs');


    exports.changerNom = (id,nom, cb)=>{
        User.findByIdAndUpdate(id, {nom:nom}, (err, user)=>{
            if(err)
                console.log(err);
            cb('Changement de nom avec succes!');
        })
    };

    exports.changerPrenom = (id,prenom, cb)=>{
        User.findByIdAndUpdate(id, {prenom:prenom}, (err, user)=>{
            if(err)
                console.log(err);
            cb('Changement de prenom avec succes!');
        })
    };

    exports.changerMail = (id,mail, cb)=>{
        User.findByIdAndUpdate(id, {email:mail}, (err, user)=>{
            if(err)
                console.log(err);
            cb('Changement de mail avec succes!');
        })
    };

   let crypter = function(val){
       return bcrypt.hashSync(val, bcrypt.genSaltSync(8), null);
    };
   let compare = function(val,val2){
        return bcrypt.compareSync(val, val2);
    };
    exports.changerPass = (id,oldpass, newpass, cb)=>{
        
        User.findById(id,(err, user)=>{
            if(err)
                console.log(err);
            if(compare(oldpass,user.password)){
                newpass = crypter(newpass);
                User.findByIdAndUpdate(id,{password:newpass},(err, user)=>{
                    if(err)
                        console.log(err);
                    cb('success');
                })
                
            }else{

                cb(false);
            }
        })
    };

    exports.changerBio = (id,bio, cb)=>{
        User.findByIdAndUpdate(id, {bio:bio}, (err, user)=>{
            if(err)
                console.log(err);
            cb('Changement de bio avec succes!');
        })
    };



    exports.ajouterRubrique = (rubrique, cb)=>{
        var newRubrique = Rubrique({
            titre:rubrique
          });
          
          newRubrique.save(function(err) {
            if (err)
                console.log(err);
            else
                cb('Rubrique ajoute avec succes!');
          });
    };

    exports.supprimerRubrique = (id, cb)=>{
        Rubrique.findByIdAndRemove(id, (err)=>{
            if(err)
                console.log(err);
            cb('Supression avec succes!');
        });
    };

    exports.afficherRubriques = (cb)=>{
        Rubrique.find({}, (err,r)=>{
            if(err)
                console.log(err);      
            return cb(r);
        })
    };

    exports.getRubriquesAndBlogs = (cb)=>{
        Rubrique.find({}, (err,r)=>{
            if(err)
                console.log(err);      
           
                Blog.find({}, (err,b)=>{
                    if(err)
                        console.log(err);      
                    return cb(r,b);
                });
        });
    };


    exports.ajouterBlog = (blog, cb)=>{
        var newBlog = Blog({
            titre:blog
          });
          
          newBlog.save(function(err) {
            if (err)
                console.log(err);
            else
                cb('Blog ajoute avec succes!');
          });
    };

    exports.supprimerBlog = (id, cb)=>{
        Blog.findByIdAndRemove(id, (err)=>{
            if(err)
                console.log(err);
            cb('Supression avec succes!');
        });
    };

    exports.afficherBlogs = (cb)=>{
        Blog.find({}, (err,r)=>{
            if(err)
                console.log(err);      
            return cb(r);
        })
    };


    exports.ajouterApprob = (approb, cb)=>{
        var newApprob = Approb(approb);
          
          newApprob.save(function(err) {
            if (err)
                console.log(err);
            else
                cb('Ajout dans la boite d\'approbation avec succes!');
          });
    };
    exports.afficherMonApprob = (id,cb)=>{
        Approb.find({idAuteur:id}, (err,r)=>{
            if(err)
                console.log(err);      
            return cb(r);
        })
    };

    exports.afficherApprobs = (cb)=>{
        Approb.find({}, (err,r)=>{
            if(err)
                console.log(err);      
            return cb(r);
        })
    };

    exports.deleteApprob = (id,cb) => {
        Approb.findByIdAndRemove(id,(err) => {
            if(err){
                console.log(err)
            }
            cb('Article supprimer de la boite d\'approbation');
        })
    }

    exports.afficherApprob = (id,cb)=>{
        Approb.findById(id, null, {sort:'-date'},(err,r)=>{
            if(err)
                console.log(err);      
            return cb(r);
        })
    };

    


    exports.approuverArticle = (id,ida,cb)=>{
        Approb.findById(id, function(err, a) {
            if (err)
                console.log(err);
          
           
           a.vote.push(ida)
          
            // save the user
            a.save(function(err) {
              if (err)
              console.log(err);
             cb('Article aprouve!');
            });
          
          });
    }

    // commentApprob
   
    exports.ajouterCommentApprob = (comment, cb)=>{
        var newComment = commentsApprob(comment);
          
          newComment.save(function(err) {
            if (err)
                console.log(err);
            else
                cb('Commentaire ajoute avec succes!');
          });
    };

    exports.afficherCommentForApprob = (id,cb)=>{
        commentsApprob.find({idArticle:id},null,{sort:'-date'}, (err,r)=>{
            if(err)
                console.log(err);      
            return cb(r);
        })
    };

    exports.afficherAuthorById = (id, cb) => {
        User.find({_id:id}, (err,r)=>{
            if(err)
                console.log(err);      
            return cb(r);
        })
    }

    exports.afficherAdmins = (cb) => {
        User.find({}, (err,r)=>{
            if(err)
                console.log(err);
            
            return cb(r);
        })
    }

    exports.publierArticle = (article,cb) => {
        let newArticle = Articles(article);

        newArticle.save((err)=>{
            if(err){
                console.log(err)
            }

            cb('Article publie!');
        })
    }

    exports.sesArticles = (id,cb) =>{
        Articles.find({idAuteur:id},null,{sort:'-date'}, (err, r) => {
            if(err){
                console.log(err)
            }

            cb(r)
        })
    }

    exports.afficherArticle = (id, cb) => {
        Articles.findById(id, (err, r)=>{
            if(err){
                console.log(err)
            }

            cb(r)
        })
    }

    exports.modifierArticle = (id, titre, categorie, contenu, cb) => {
        Articles.findByIdAndUpdate(id, {titre:titre, categorie:categorie, contenu:contenu}, (err, r) => {
            if(err){
                console.log(err)
            }

            cb('Article modifie avec success!')
        })
    }

    exports.modifierApprob = (id, titre, categorie, contenu, cb) => {
        Approb.findByIdAndUpdate(id, {titre:titre, categorie:categorie, contenu:contenu}, (err, r) => {
            if(err){
                console.log(err)
            }

            cb('Article modifie avec success!')
        })
    }

    exports.afficherGallerie = (id,page, cb) =>{
        Gallerie.paginate({}, { page:page, limit: 1, sort: { date: -1 } }, function(err,result) {
            cb(result);
        });
    }