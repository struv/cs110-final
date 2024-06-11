//Import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv')
const mongoose = require("mongoose");
const cors = require('cors');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const {check, validationResult} = require('express-validator')

const {ensureAuth, ensureGuest} = require('./middleware/auth');

//Import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const nickHandler = require('./controllers/nick.js');
const msgHandler = require('./controllers/message.js');
const loginHandler = require('./controllers/login.js');
const profileHandler = require('./controllers/profile.js');
const { roomIdGenerator } = require('./util/roomIdGenerator.js');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Room = require('./models/chatroom.js');
const User = require('./models/user.js');
const nicknameHandler = require('./controllers/nickname.js');
const { findOneAndUpdate } = require('./models/user');

const app = express();
const port = 8080;

// Dotenv config
dotenv.config({ path: './config/config.env' })


// Passport config
require('./config/passport.js')(passport)

//MongoDB connection string and options
const clientOptions = { 
    serverApi: { version: '1', strict: true, deprecationErrors: true }
};

//Login middleware
app.use(session ({
    cookie: {maxAge: 360000},
    secret: 'sess',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize());
app.use(passport.session());


//Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(nicknameHandler);

// Routes

//View engine setup
const hbsOptions = {
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, '/views/layouts/'),
    handlebars: allowInsecurePrototypeAccess(require('handlebars'))
};
app.engine('hbs', hbs(hbsOptions));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// mongoose.connect('mongodb://localhost:27017/')
//     //check connection
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch(err => {
//         console.error('Error connecting to MongoDB:', err);
//     });

//define Schema
// const roomSchema = new mongoose.Schema({
//     id: String,
//     name: String
// }, { versionKey: false });


// module.exports ={ Room};


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
//view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/', }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Create controller handlers to handle requests at each endpoint
app.use('/auth', require('./routes/auth.js'));

mongoose.connect(process.env.MONGO_URI, clientOptions)
    .then(() => {
        console.log("Connected to MongoDB");

        app.get('/', ensureGuest, loginHandler.getLogin);

        app.get('/profile', ensureAuth, profileHandler.getProfile);

        app.post('/subProfile', ensureAuth,[
            check('fname').matches(/^[A-Za-z\s]+$/).withMessage('First name must be alphabetic.').trim().escape(), 

            check('lname').matches(/^[A-Za-z\s]+$/).withMessage('Last name must be alphabetic.').trim().escape(), 

            check('aboutme').optional().trim().escape()
            ], async (req, res) => {
                let userID = req.session.passport.user;
                let actual = await User.findById(userID);
                let errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.render('profile', {firstName: actual.firstName, lastName: actual.lastName, errors: errors.array()});
                }
                else {
                    if(actual.firstName !== req.body.fname) await User.findOneAndUpdate({_id: userID}, {firstName: req.body.fname});
                    if(actual.lastName !== req.body.lname) await User.findOneAndUpdate({_id: userID}, {lastName: req.body.lastName});
                    if(actual.lastName !== req.body.aboutme) await User.findOneAndUpdate({_id: userID}, {aboutMe: req.body.aboutme});
    
                    res.redirect('/home');
                }
        });

        app.get('/home', ensureAuth, homeHandler.getHome);

        app.post('/sendMessage', ensureAuth, msgHandler.postMessage);

        app.post("/create", ensureAuth, async (req, res) => {
            const roomName = req.body.roomName;
            req.session.nickname = req.body.nickname;

            if (!roomName || roomName.trim() === "") {
                return res.send('Room name is required and cannot be empty.');
            }

            try {
                //Check if room exists already
                const exist = await Room.findOne({ name: roomName });
                if (exist) {
                    return res.send('Identical room name already exists!');
                }

                const newRoom = new Room({
                    id: roomIdGenerator(), //from util!
                    name: roomName,
                });

                await newRoom.save();
                //res.send('Room created successfully.' );

                //Respond with success message or redirect as needed
                res.redirect('/');

            } catch (err) {
                console.error('Error creating room:', err);
                res.status(500).send('Internal server error.');
            }
        });

        app.get('/:roomName', ensureAuth, roomHandler.getRoom);

        app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
});



