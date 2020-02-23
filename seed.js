require('dotenv').config();
require('./lib/utils/connect')();
const scrapeData = require('./scrapers/infoScraper');
const Character = require('./lib/Models/Character');
const mongoose = require('mongoose');

scrapeData()
  .then(chars => Character.create(chars))
  .finally(() => mongoose.connection.close());