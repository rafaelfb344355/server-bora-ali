const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
  Nome: {
    type: String
  },
  Email: {
    type: String
  },
 Senha: {
    type: String
  },
  picture: {
    type: String
  }
},
{
    collection: 'User'
});

try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', UserSchema);
}