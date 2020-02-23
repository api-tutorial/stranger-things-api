const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  status: String,
  born: String,
  aliases: {
    type: [String],
    default: ['unknown']
  },
  otherRelations: {
    type: [String],
    default: ['unknown']
  },
  affiliation: {
    type: [String],
    default: ['unknown']
  },
  occupation: {
    type: [String],
    default: ['unknown']
  },
  gender: String,
  eyeColor: String,
  hairColor: String,
  portrayedBy: String,
  appearsInEpisodes: {
    type: [String],
    default: ['unknown']
  },
});

module.exports = mongoose.model('Character', characterSchema);
