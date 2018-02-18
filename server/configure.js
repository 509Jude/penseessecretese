const path = require('path'),
        fs = require('fs'),
        routes = require('./routes'),
        exphbs = require('express-handlebars'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        morgan = require('morgan'),
        methodOverride = require('method-override'),
        errorhandler = require('errorhandler'),
        mongoose = require('mongoose'),
        session = require('express-session'),
        MongoStore = require('connect-mongo')(session),
        flash = require('connect-flash'),
        formidable = require('formidable'),
        passport = require('passport');
        url = 'mongodb://Jude:Espagne1492@ds233148-a0.mlab.com:33148,ds233148-a1.mlab.com:33148/penseessecretes?replicaSet=rs-ds233148';

        //'mongodb://localhost/ps'

module.exports = app =>{
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser('my-secret-value'));

    //exphbs.registerHelper('dateFormat', require('handlebars-dateformat'));

  

    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',
        layoutsDir:  `${app.get('views')}/layouts`,
        partialsDir: [ `${app.get('views')}/partials`],
        helpers: {
            timeago: (timestamp)=>{
                //console.log(timestamp.now);
                return moment(timestamp).startOf('minute').fromNow();
            },
            dateFormat :  require('handlebars-dateformat'),
            trimString : function(passedString) {
                var theString = passedString.toString();
                return  theString.slice(0,900)+" ...."
            }
        }
    }).engine);

    app.set('view engine', 'handlebars');
    app.set("json spaces", 4);

    mongoose.connect(url);
    mongoose.connection.on('error', function() {
        console.error('MongoDB Connection Error. Make sure MongoDB isrunning.');
    });

    // Passport configuration
     require('./passport')(passport);

    app.use(session({
        secret: 'sometextgohere',
        saveUninitialized: true,
        resave: true,
    
        store: new MongoStore({
        url:url,
        collection : 'sessions'
     })
  }));

    // Init passport authentication
    app.use(passport.initialize());
    // persistent login sessions
    app.use(passport.session());
    // flash messages
    app.use(flash());
       
        
    routes(app);//moving the routes to routes folder

    
    
   

    if('development' === app.get('env')){
        app.use(errorhandler());
    }

    return app;
};