require('dotenv').config();
const express = require('express');
const app = express();
const expressGa = require('express-ga-middleware');

const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(expressGa(process.env.GOOGLE_ID));
 
app.use('/api/v1/characters', require('./routes/characters'));

module.exports = app;
