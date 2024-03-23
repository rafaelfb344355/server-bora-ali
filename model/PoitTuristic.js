const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PoitTuristic = new Schema({
  Nome: {
    type: String
  },
  descriçao: {
    type: String
  },
 horario: {
    type: String
  },
valoringresso: {
    type: String
  },
  picture1: {
    type: String
  },
  picture2: {
    type: String
  },
  picture3: {
    type: String
  },
  lon: {
    type: String
  },
  lat: {
    type: String
  }

},{
    collection: 'PoitTuristic'
});

module.exports = mongoose.model('PoitTuristic', PoitTuristic);