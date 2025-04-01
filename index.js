// SGN , JSP, JSRK, JSLN, JMD, JVM , JSm, JSSR, JBB, JBB, JKM, JJJ 
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const session = require('express-session');
const { requireAuth, checAuth } = require('./utils/Auth');
require('dotenv').config();

const app = express()
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ub8kg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then( res => {
    console.log('Connected to db')
})
.catch(err => { console.error(err)})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'dummy key',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.use(checAuth);

app.use(router);

const port = process.env.PORT || 3000;  // Fallback to 3000 if PORT isn't set
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});