
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
const usuario = process.env.USUARIO;
const senha = process.env.SENHA;
const nomeBancoDados = 'BoraAliDB';
const poitTuristicRoutes = express.Router();
const userRoutes = express.Router();
const Port = process.env.PORT || 3001;

// Definindo o esquema para o ponto turístico
const PoitTuristicSchema = new mongoose.Schema({
  Nome: String,
  descricao: String, // Corrigido o nome do campo
  horario: String,
  valoringresso: String,
  picture1: String,
  picture2: String,
  picture3: String,
  lon: String,
  lat: String
}, {
  collection: 'PoitTuristic'
});

let PoitTuristic;
try {
  PoitTuristic = mongoose.model('PoitTuristic');
} catch (error) {
  PoitTuristic = mongoose.model('PoitTuristic', PoitTuristicSchema);
}

let UserSchema = new  mongoose.Schema({

  Nome: String,
  Email: String,
  Senha: String,
  Curtidas: [String],
  picture:String
 
},
{
    collection: 'User'
});
let User;
try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', UserSchema);
}


// api para adicionar ponto turístico
poitTuristicRoutes.route('/add').post(function (req, res) {
  let poitTuristic = new PoitTuristic(req.body);
  poitTuristic.save()
    .then(() => {
      res.status(200).json({'status': 'success','mssg': 'Ponto turístico adicionado com sucesso'});
    })
    .catch(err => {
      res.status(409).send({'status': 'failure','mssg': 'Não foi possível salvar no banco de dados'});
    });
});

// api para obter todos os pontos turísticos
poitTuristicRoutes.route('/').get(function (req, res) {
  PoitTuristic.find(function (err, poitTuristics) {
    if(err){
      res.status(400).send({'status': 'failure','mssg': 'Algo deu errado'});
    }
    else {
      res.status(200).json({'status': 'success','poitTuristics': poitTuristics});
    }
  });
});

// api para obter ponto turístico por nome
poitTuristicRoutes.route('/name/:name').get(function (req, res) {
  let name = req.params.name;
  PoitTuristic.find({ Nome: name }, function(err, poitTuristics) {
    if (err) {
      res.status(500).send('Erro interno do servidor');
    } else if (poitTuristics.length === 0) {
      res.status(404).send('Nenhum ponto encontrado');
    } else {
      res.status(200).json(poitTuristics);
    }
  });
});

// api para obter ponto turístico por ID
poitTuristicRoutes.route('/:id').get(function (req, res) {
  let id = req.params.id;
  PoitTuristic.findById(id, function (err, poitTuristic){
    if(err){
      res.status(400).send({'status': 'failure','mssg': 'Algo deu errado'});
    }
    else {
      res.status(200).json({'status': 'success','poitTuristic': poitTuristic});
    }
  });
});

// api para excluir ponto turístico
poitTuristicRoutes.route('/delete/:id').delete(function (req, res) {
  PoitTuristic.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.status(400).send({'status': 'failure','mssg': 'Algo deu errado'});
    }
    else {
      res.status(200).json({'status': 'success','mssg': 'Excluído com sucesso'});
    }
  });
});



// API to add a user
userRoutes.route('/add').post(function(req, res) {
  let user = new User(req.body);
  user.save()
    .then(user => {
      res.status(200).json({ 'status': 'success', 'message': 'User added successfully' });
    })
    .catch(err => {
      res.status(500).send({ 'status': 'failure', 'message': 'Unable to save to the database' });
    });
});

// API to get all users
userRoutes.route('/').get(function(req, res) {
  User.find(function(err, users) {
    if (err) {
      res.status(500).send({ 'status': 'failure', 'message': 'Something went wrong' });
    } else {
      res.status(200).json({ 'status': 'success', 'users': users });
    }
  });
});

// API to get a user by ID
userRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id;
  User.findById(id, function(err, user) {
    if (err) {
      res.status(400).send({ 'status': 'failure', 'message': 'Something went wrong' });
    } else {
      res.status(200).json({ 'status': 'success', 'user': user });
    }
  });
});

// API to update a user by ID
userRoutes.route('/update/:id').put(function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (!user) {
      res.status(400).send({ 'status': 'failure', 'message': 'Unable to find user' });
    } else {
      user.Nome = req.body.Nome;
      user.Email = req.body.Email;
      user.Senha = req.body.Senha;
      user.Curtidas = req.body.Curtidas;
      user.picture = req.body.picture;

      user.save()
        .then(() => {
          res.status(200).json({ 'status': 'success', 'message': 'Update complete' });
        })
        .catch(err => {
          res.status(500).send({ 'status': 'failure', 'message': 'Unable to update user' });
        });
    }
  });
});

// API to delete a user by ID
userRoutes.route('/delete/:id').delete(function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.status(400).send({ 'status': 'failure', 'message': 'Something went wrong' });
    } else {
      res.status(200).json({ 'status': 'success', 'message': 'Delete successfully' });
    }
  });
});

userRoutes.route('/login').post(async function(req, res) {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe no banco de dados
    const user = await User.findOne({ Email: email });

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verificar a senha
    if (user.Senha !== password) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Autenticação bem-sucedida
    console.log( user._id );
    res.status(200).json({ message: 'Login bem-sucedido', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});




mongoose.Promise = global.Promise;
// Conectar ao banco de dados MongoDB


const mongoose = require('mongoose');



mongoose.connect(`mongodb+srv://${usuario}:${senha}@boraalidb.paquwbm.mongodb.net/${nomeBancoDados}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Banco de dados conectado');
  })
  .catch(err => {
    console.log('Não foi possível conectar ao banco de dados: ' + err);
  });


var app = express();
app.use(bodyParser.json());
app.use(cors());


// Rota principal
app.use('/poitTuristic', poitTuristicRoutes);
app.use('/user', userRoutes);

app.get('/', userRoutes);
app.get("/user/:id",userRoutes);

app.listen(Port, function(){
    console.log('Escutando na porta ' + Port);
});
