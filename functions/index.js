const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
const cors = require('cors');
const appRoute = require('./Route/countRoute')

admin.initializeApp(functions.config().firebase)

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,  Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method,   Access-Control-Request-Headers');
    //and remove caching so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
 
app.get(['/getCount/organizer/:event'],appRoute);
app.get(['/getCount/participant/:event/:userid'],appRoute);
app.get(['/getCount/sponsor/:event/:sponsorid/:userid'],appRoute);
app.get(['/getCount/speaker/:event/:speakerid/:userid'],appRoute);

const count = functions.https.onRequest(app);

module.exports = { count }