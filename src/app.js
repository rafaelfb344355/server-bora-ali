
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
const seu_usuario = 'rafael344355';
const senha = 'ndTwvS5JFefCMrBd';
const poitTuristicRoutes = express.Router();

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

const PoitTuristic = mongoose.model('PoitTuristic', PoitTuristicSchema);

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

mongoose.Promise = global.Promise;
// Conectar ao banco de dados MongoDB
mongoose.connect('mongodb+srv://rafael344355:ndTwvS5JFefCMrBd@boraalidb.paquwbm.mongodb.net/test', { useNewUrlParser: true , useUnifiedTopology: true }).then(
  () => {console.log('Banco de dados conectado') },
  err => { console.log('Não foi possível conectar ao banco de dados'+ err)}
);

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/', function(req, res, next) {
  console.log('hello world');
  next(); // Chama o próximo middleware na pilha
});
// Rota principal
app.use('/poitTuristic', poitTuristicRoutes);

app.listen(Port, function(){
    console.log('Escutando na porta ' + Port);
});
