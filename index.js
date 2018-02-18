const express = require('express');
config = require('./server/configure');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
let User = require('./models/user');
let Gallerie = require('./models/gallerie');

let app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', `${__dirname}/views`);
app.use( express.static(path.join(__dirname,'/public')));
app = config(app);


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    return next();
    res.redirect('/');
 }

app.post('/upload/admin/profil', isLoggedIn, (req,res) => {
    // create an incoming form object
  var form = new formidable.IncomingForm();
  
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
  
    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname,'/public/img/profile');
  
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
      let photo = req.user.photo;
      if(photo!=='default.png')
      {
          fs.unlinkSync(path.join(__dirname,'/public/img/profile/'+photo));
      }

      User.findByIdAndUpdate(req.user.id, {photo:file.name}, (err, user)=>{
          if(err){
              console.log(err)
          }
      })

     
      
    });
  
    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });
  
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        let title = 'Admin';
        let showUsernameNav = true;

        res.render('admin',{
            user:req.user,
            title:title,
            showUsernameNav : showUsernameNav ,
            showAdmLink : false,
            prenom : req.user.prenom
        });
    });
  
    // parse the incoming request containing the form data
    form.parse(req);

    
})



app.post('/admin/gallerie', isLoggedIn, (req,res) => {
    // create an incoming form object
  var form = new formidable.IncomingForm();
  
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
  
    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname,'/public/img/gallerie');
  
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
      Gallerie({
          idAuteur : req.user.id,
          nom : file.name
      }).save((err)=>{
          if(err){
              console.log(err)
          }
      })
    });
  
    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });
  
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        let title = 'Admin';
        let showUsernameNav = true;

        res.render('gallerie');
    });
  
    // parse the incoming request containing the form data
    form.parse(req);

    
})


app.listen(app.get('port'), ()=>{
    console.log(`App set up at : http://localhost:${app.get('port')}`);
});