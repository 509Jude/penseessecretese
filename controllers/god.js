
let q = require('./godQueries');
let User = require('../models/user');


 module.exports = {
   afficherAdm : (req,res)=>{
    q.afficherAdm((users)=>{
        res.json(users);
    });
   },

   supprimerAdm: (req,res)=>{
       q.supprimerAdm(req.params.id, (text)=>{
            res.json(text);
       });
   },

   whoIam : (req,res)=>{
    res.json(req.user);
 },

 setMe_god: (req,res)=>{
     if(req.params.pass=='espagne1492'){
        q.setMe_god(req.user.id, (text)=>{
            res.json(text);
       });
     }else{
         res.json('Vous n\'avez pas la permission');
     }

},

 };