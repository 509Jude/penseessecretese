let passport = require('passport');
let q = require('./adminQueries');
let Gallerie = require('../models/gallerie');
let Articles = require('../models/articles');
/* check if user is logged in */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    return next();
    res.redirect('/login');
 }

 function ValidateEmail(mail)   
 {  
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
   {  
     return (true)  
   }  
     
     return (false)  
 } 

module.exports = {

    admin:(req,res)=>{
        let title = 'Admin';
        let showUsernameNav = true;



        res.render('admin',{
            padmin:true,
            user:req.user,
            title:title,
            showUsernameNav : showUsernameNav ,
            showAdmLink : false,
            p : true,
            prenom : req.user.prenom
        });
    },

    inscription: (req,res)=>{
        let title = 'inscription';
        let showUsernameNav = false;
        res.render('inscription',{
            padmin:true,
            title:title,
            showUsernameNav : showUsernameNav,
            showAdmLink : false,
            message:req.flash('signupMessage') 
        });
    },
    _inscription:  passport.authenticate('local-signup', {
        //Success go to Profile Page / Fail go to Signup page
        successRedirect : '/admin/connexion',
        failureRedirect : '/admin/inscription',
        failureFlash : true
       }),

    connexion: (req,res)=>{
        let title = 'connexion';
        let showUsernameNav = false;
        
        res.render('connexion',{
            padmin:true,
            title:title,
            showUsernameNav : showUsernameNav,
            showAdmLink : false,
            message: req.flash('loginMessage')
        });
    },
    _connexion: passport.authenticate('local-login', {
        //Success go to Profile Page / Fail go to login page
        successRedirect : '/admin',
        failureRedirect : '/admin/connexion',
        failureFlash : true
       }),


    deconnexion:(req,res)=>{
        req.logout();
        res.redirect('/');
    },



    changerNom:(req,res)=>{
        q.changerNom(req.user.id,req.params.nom, (text)=>{
            res.json(text);
        });
    },

    changerPrenom:(req,res)=>{
        q.changerPrenom(req.user.id,req.params.prenom, (text)=>{
            res.json(text);
        });
    },

    changerMail:(req,res)=>{

        if(ValidateEmail(req.params.mail)){
            q.changerMail(req.user.id,req.params.mail, (text)=>{
                res.json(text);
            });
        }else{
            let message = "Oupss!! Adresse mail invalide.";
            res.render("erreur",{  padmin:true, message:message});
        }
    },

    changerPass:(req,res)=>{
                    q.changerPass(req.user.id,req.params.oldpass,req.params.newpass,(text)=>{
                        res.json(text);
                    });
                
            },

    changerBio:(req,res)=>{
        
            q.changerBio(req.user.id,req.params.bio, (text)=>{
                res.json(text);
            });
    },

    afficherRubriques:(req,res)=>{
        q.afficherRubriques((r)=>{
            res.render('rubriques',{
                padmin:true,
                rubriques:r,
                showUsernameNav : true,
                showAdmLink : true
            });
        })
    },
    supprimerRubrique:(req,res)=>{
        q.supprimerRubrique(req.params.id, (text)=>{
            res.redirect('/admin/afficher/rubriques');
        });
    },
    ajouterRubrique:(req,res)=>{
            q.ajouterRubrique(req.body.rubrique, (text)=>{
                res.redirect('/admin/afficher/rubriques');
            })
    },

    afficherBlogs:(req,res)=>{
        q.afficherBlogs((r)=>{
            res.json(r);
        })
    },
    supprimerBlog:(req,res)=>{
        q.supprimerBlog(req.params.id, (text)=>{
            res.json(text);
        });
    },
    ajouterBlog:(req,res)=>{
            q.ajouterBlog(req.params.blog, (text)=>{
                res.json(text);
            })
    },

    ecrireArticle:(req,res)=>{
        q.afficherMonApprob(req.user.id, (r)=>{
            if(r.length>0){
                let message = "Oupss!! Vous avez deja un article en cours d'approbation.";
                res.render("erreur",{ padmin:true, message:message});
            }else{
                        q.getRubriquesAndBlogs((r,b)=>{
                            let title = 'Editeur',
                            showUsernameNav = true,
                            rubriques = r,
                            blogs = b;
                        res.render('editeur', {
                            padmin:true,
                            tinymce : true,
                            title:title,
                            showUsernameNav : true,
                            showAdmLink : true,
                            prenom:req.user.prenom,
                            rubriques:rubriques,
                            blogs : blogs
                        }
                        );
                    });
            }
        });

      

    },

    
    _ecrireArticle:(req,res)=>{
        
        let idAuteur = req.user.id,
            nomAuteur = req.user.nom,
            prenomAuteur = req.user.prenom,
            titre = req.body.titre,
            categorie = req.body.categorie,
            contenu = req.body.contenu,
            image = req.body.image,
            message = "";

            if(titre=="")
                message = "Entrez un titre!";
            
            if (categorie=="")
                message = "Selectionez une categorie!";

            if(contenu=="")
                message = "Veuillez inserer un contenu pour l'article!";

            if(image=="")
                message = "Veuillez inserer une image pour l'article!";

                
            if(message!=""){
                    q.getRubriquesAndBlogs((r,b)=>{
                        let title = 'Editeur',
                        showUsernameNav = true,
                        rubriques = r,
                        blogs = b;
                    res.render('editeur', {
                        padmin:true,
                        title:title,
                        showUsernameNav : true,
                        showAdmLink : true,
                        prenom:req.user.prenom,
                        rubriques:rubriques,
                        blogs : blogs,
                        message:message,
                        contenu:contenu,
                        image:image
                    }
                    );
                });
            }else{

               let approb =  {
                    idAuteur:idAuteur,
                    nomAuteur : nomAuteur,
                    prenomAuteur : prenomAuteur,
                    titre:titre,
                    categorie:categorie,
                    contenu:contenu,
                    image : image    
                  };

                  q.ajouterApprob(approb,(text)=>{
                    res.redirect('/admin');
                  });
            }
               
    },

    voirMaBoite:(req,res)=>{
        q.afficherMonApprob(req.user.id,(r)=>{

            if(!r.length){
                let message = "Vous n'avez aucun article en cours d'approbation.";
                res.render("erreur",{ padmin:true,message:message});
                    
            }else{
                q.afficherCommentForApprob(r[0]._id, (c)=>{
                    
                    res.render('probation', {
                        padmin:true,
                        title: "probation",
                        approb : r[0],
                        user:req.user,
                        showVoteBtn:false,
                        showUsernameNav : true,
                        showAdmLink : true,
                        comments : c,
                        html : '<h1>Hey there!</h1>'
                    })
                })
            }

           
              
        });
    },

    _addComment:(req,res)=>{
    
        let comment = {
            idArticle:req.params.id,
            contenu:req.body.comment,
            nom:req.user.nom,
            prenom:req.user.prenom
            }

            q.ajouterCommentApprob(comment, (r)=>{
                res.redirect('/admin/voir/ma/boite')
            })
    },
    voirBoite:(req,res)=>{
        q.afficherApprobs((r)=>{
            if(r.length==0){
                let message = " Aucun article en cours d'approbation.";
                res.render("erreur",{message:message});
            }else{
                res.render('listApprob',{padmin:true, approbs : r })
            }
           
        });
    },

    
    approuverArticle : (req,res) => {
        q.afficherApprob(req.params.id,(a)=>{
            q.afficherCommentForApprob(a._id, (c)=>{
                q.afficherAdmins((u)=>{
                    console.log(u)
                    res.render('probation', {
                        padmin:true,
                        title: "probation",
                        approb : a,
                        user:req.user,
                        showVoteBtn:req.user.id==a.idAuteur,
                        nbrAdmin : u,
                        comments : c,
                        showUsernameNav : true,
                        showAdmLink : true
                    })
                })
            })
        })
    },

    _approuverArticle : (req,res)=>{

       
       
        q.afficherApprob(req.params.id,(a)=>{
            let exist = a.vote.some(item => item._id==req.user.id);
            let self = a.idAuteur == req.user.id;
            if(exist){
                    let message = "Vous avez deja approuvez cet article";
                    res.render("erreur",{message:message});
            }else if(self){
                let message = "Vous ne pouvez pas approuvez votre propre article";
                res.render("erreur",{message:message});
            }else{
                q.approuverArticle(req.params.id, req.user.id, (txt)=>{
                    res.redirect("/admin/approuver/article/"+req.params.id)
                 });
            }
        });
        
       
     },

     publier : (req,res)=>{
         let id = req.params.id;

         q.afficherApprob(id,(r)=>{
             if(r.idAuteur==req.user._id){
                        let article = {
                            idAuteur:r.idAuteur,
                            nomAuteur : r.nomAuteur,
                            prenomAuteur : r.prenomAuteur,
                            bioAuteur : req.user.bio,
                            photoAuteur : req.user.photo,
                            titre:r.titre,
                            categorie:r.categorie,
                            contenu:r.contenu,
                            image : r.image
                    }

                    q.publierArticle(article,(r)=>{
                        console.log(r);
                        q.deleteApprob(id, (r) => {
                            console.log(r);
                            res.redirect('/admin');
                        })
                    })
             }
         })
     },

     sesArticles:(req,res)=>{

        Articles.paginate({idAuteur:req.user.id}, { page:req.params.page, limit: 4, sort: { date: -1 } }, function(err,result) {
           if(result.docs.length==0){
            let message = " Aucun article  publié .";
            res.render("erreur",{padmin:true,message:message});
           }else{
            let pages = [];
            for(i=1; i<=result.pages; i++)
                pages.push(i)
            pages.sort()
            
            res.render('sesArticles',{
                padmin:true,
                showUsernameNav : true,
                showAdmLink : true,
                approbs : result.docs,
                showPagination : pages.length > 1,
                pages : pages,
                next :  result.page <2 ? parseInt(result.page)+1 : 3,
                previous : result.page > 1 ? parseInt(result.page)-1 : 1,
            })
           }
        });

    },

    modifierApprob : (req,res) => {
       q.afficherMonApprob(req.user.id, (r)=>{
          q.getRubriquesAndBlogs((rb,b)=>{
            if(req.user.id==r[0].idAuteur){
                
                res.render('modifierApprob',{
                    padmin:true,
                    tinymce : true,
                    id : r[0]._id,
                    titre : r[0].titre,
                    categorie : r[0].categorie,
                    contenu : r[0].contenu,
                    image : r[0].image,
                    rubriques : rb,
                    showUsernameNav : true,
                    showAdmLink : true
                  })
               }
          })
       })
    },

    _modifierApprob : (req,res) => {
        q.modifierApprob(req.params.id, req.body.titre, req.body.categorie, req.body.contenu, (r)=>{
            console.log(r)
            res.redirect('/admin')
        })
     },


    modifierArticle : (req,res) => {
        q.afficherArticle(req.params.id, (r)=>{
            q.getRubriquesAndBlogs((rb,b)=>{
                
                if(req.user.id==r.idAuteur){
                    
                    res.render('modifierArticle',{
                        padmin:true,
                        tinymce : true,
                        id : r._id,
                        titre : r.titre,
                        categorie : r.categorie,
                        contenu : r.contenu,
                        image : r.image,
                        rubriques : rb,
                        showUsernameNav : true,
                        showAdmLink : true
                      })
                   }
            })
        })
    },

    _modifierArticle : (req,res) => {
       q.modifierArticle(req.params.id, req.body.titre, req.body.categorie, req.body.contenu, (r)=>{
           console.log(r)
           res.redirect('/admin')
       })
    },

    gallerie : (req,res)=>{

        Gallerie.paginate({idAuteur:req.user.id}, { page:req.params.page, limit: 1, sort: { date: -1 } }, function(err,result) {
            let pages = [];
            for(i=1; i<=result.pages; i++)
                pages.push(i)
            pages.sort()
            console.log(pages)
            res.render('gallerie',{
                padmin:true,
                g : true,
                p: false,
                images : result.docs,
                pages : pages,
                next :  result.page <2 ? parseInt(result.page)+1 : 3,
                previous : result.page > 1 ? parseInt(result.page)-1 : 1,
                showUsernameNav : true,
                showAdmLink : true
            })
        });
    }

};

