const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  status: String,
  born: String,
  aliases: String,
  otherRelations: [String],
  affiliation: String,
  occupation: String,
  gender: String,
  eyeColor: String,
  hairColor: String,
  portrayedBy: String,
  appearsInEpisodes: [String]
});

module.exports = mongoose.model('Character', characterSchema);