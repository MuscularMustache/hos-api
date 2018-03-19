const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./services/auth');
const MongoStore = require('connect-mongo')(session);
const schema = require('./schema/schema');
const keys = require('../config/keys');
const cors = require('cors'); // cors is required becauce graphql is making request with 'OPTIONS' method - try to find other solution to properly process requests

const app = express();

const MONGO_URI = keys.mongo;
if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI');
}

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_URI);
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

// Configures express to use sessions.  This places an encrypted identifier on the users cookie.
//- When a user makes a request, this middleware examines the cookie and modifies the request object
//- to indicate which user made the request. The cookie itself only contains the id of a session;
//- more data about the session is stored inside of MongoDB.
// TODO: change this secret and store it in local keys
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'aaabbbccc',
  store: new MongoStore({
    url: MONGO_URI,
    autoReconnect: true
  })
}));

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also servces/auth.js
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

// NOTE: necessary for passing login credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('listening on port 4000');
});
