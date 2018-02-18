let User = require('../models/user');


    exports.afficherAdm = (cb)=>{
        User.find({}, (err,users)=>{
            if(err)
                console.log(err);

            
            return cb(users);
        })
    };

    exports.supprimerAdm = (id, cb)=>{
        User.findByIdAndRemove(id, (err)=>{
            if(err)
                console.log(err);
            cb('Supression avec succes!');
        })
    };

    exports.setMe_god = (id, cb)=>{
        User.findByIdAndUpdate(id, {role:'god'}, (err, user)=>{
            if(err)
                console.log(err);
            cb('You are god now');
        })
    };
