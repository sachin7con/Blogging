const express = require('express');
const mongoose = require('mongoose');
const router = require('../routes');
const session = require('express-session');
const { requireAuth, checAuth } = require('../utils/Auth');
require('dotenv').config();
const cors = require('cors');


const app = express();
app.use(cors());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'dummy key',
    resave: false,
    saveUninitialized: false,
  })
);

app.set('view engine', 'ejs');

// Middleware
app.use(checAuth);

// Routes
app.use(router);

// Export for Vercel (no app.listen)
module.exports = app;
