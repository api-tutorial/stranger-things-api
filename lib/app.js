const express = require('express');
const app = express();

const cors = require('cors');

app.use(express.json());
app.use(cors());
 
app.use('/api/v1/characters', require('./routes/characters'));


module.exports = app;
