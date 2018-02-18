const express = require('express'),
      router = express.Router(),
      home = require('../controllers/home');
      admin = require('../controllers/admin');
      god = require('../controllers/god');

      function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
        return next();
        res.redirect('/');
     }
     function is_god(req, res, next) {
        if (req.user.role === "god")
        return next();
        res.redirect('/');
     }

module.exports = app =>{
    router.get('/', home.index);

    router.get('/admin/inscription', admin.inscription);
    router.post('/admin/inscription', admin._inscription);

    router.get('/admin/connexion', admin.connexion);
    router.post('/admin/connexion', admin._connexion);
    router.get('/admin', isLoggedIn,admin.admin);
    router.get('/admin/deconnexion',isLoggedIn, admin.deconnexion);

    router.get('/admin/changer/nom/:nom', isLoggedIn,admin.changerNom);
    router.get('/admin/changer/prenom/:prenom',isLoggedIn, admin.changerPrenom);
    router.get('/admin/changer/mail/:mail', isLoggedIn,admin.changerMail);
    router.get('/admin/changer/pass/:oldpass/:newpass', isLoggedIn,admin.changerPass);
    router.get('/admin/changer/bio/:bio', isLoggedIn,admin.changerBio);

    router.post('/admin/ajouter/rubrique',isLoggedIn, admin.ajouterRubrique);
    router.get('/admin/supprimer/rubrique/:id', isLoggedIn,admin.supprimerRubrique);
    router.get('/admin/afficher/rubriques', isLoggedIn,admin.afficherRubriques);

    router.get('/admin/ajouter/blog/:blog',isLoggedIn, admin.ajouterBlog);
    router.get('/admin/supprimer/blog/:id',isLoggedIn, admin.supprimerBlog);
    router.get('/admin/afficher/blogs', isLoggedIn, admin.afficherBlogs); 
    
    router.get('/admin/ecrire/article',isLoggedIn, admin.ecrireArticle);
    router.post('/admin/ecrire/article',isLoggedIn, admin._ecrireArticle);
    router.get('/admin/voir/ma/boite', isLoggedIn,admin.voirMaBoite);
    router.post('/admin/approb/add-comment/:id', isLoggedIn,admin._addComment);
    router.get('/admin/voir/boite',isLoggedIn, admin.voirBoite);
    router.get('/admin/approuver/article/:id', isLoggedIn,admin.approuverArticle);
    router.get('/admin/publier/:id', isLoggedIn,admin.publier);
    router.get('/admin/ses-articles/:page', isLoggedIn,admin.sesArticles);
    //router.get('/admin/ses-articles', isLoggedIn,admin.sesArticles);
    router.get('/admin/modifier/approb', isLoggedIn,admin.modifierApprob);
    router.post('/admin/modifier/approb/:id', isLoggedIn,admin._modifierApprob);
    router.get('/admin/modifier/article/:id', isLoggedIn,admin.modifierArticle);
    router.post('/admin/modifier/article/:id', isLoggedIn,admin._modifierArticle);
    router.get('/admin/gallerie/:page', isLoggedIn,admin.gallerie);

    router.get('/god/afficher-adms', isLoggedIn, is_god, god.afficherAdm);
    router.get('/god/supprimer-adms/:id', isLoggedIn ,is_god, god.supprimerAdm);
    router.get('/god/who-i-am',isLoggedIn , is_god, god.whoIam);
    router.get('/god/set-me-god/:pass', isLoggedIn, god.setMe_god);


    router.get('/:page',home.index);
    //router.get('/vue/:page',home.indexVue);
    router.get('/lire/:id',home.lire);

    router.get('*', (req,res)=>{
        res.send('404 - page not found');
    });
   
    app.use(router);
};