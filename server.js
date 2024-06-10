//Import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const mongoose = require("mongoose");
const cors = require('cors');

//Import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const nickHandler = require('./controllers/nick.js');
const msgHandler = require('./controllers/message.js');
const { roomIdGenerator } = require('./util/roomIdGenerator.js');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Room = require('./models/chatroom.js');
const nicknameHandler = require('./controllers/nickname.js');

const app = express();
const port = 8080;

//MongoDB connection string and options
const uri = "mongodb+srv://ahan058:DHXXha0ZrqiVCKcT@cluster0.hj10yd6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { 
    serverApi: { version: '1', strict: true, deprecationErrors: true }
};

//Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(nicknameHandler);

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

mongoose.connect(uri, clientOptions)
    .then(() => {
        console.log("Connected to MongoDB");

        // Create controller handlers to handle requests at each endpoint
        
        app.get('/', homeHandler.getHome);
        app.get('/:roomName', roomHandler.getRoom);

        
        app.post('/sendMessage', msgHandler.postMessage);


        app.post("/create", async (req, res) => {
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

        app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });
// set up stylesheets route


// TODO: Add server side code
