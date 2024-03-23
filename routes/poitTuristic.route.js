const express = require('express');
const app = express();
const poitTuristicRoutes = express.Router();
const PoitTuristic = require('../model/PoitTuristic');

// api to add poitTuristic
poitTuristicRoutes.route('/add').post(function (req, res) {
  let poitTuristic = new PoitTuristic(req.body);
  poitTuristic.save()
  .then(poitTuristic => {
    res.status(200).json({'status': 'success','mssg': 'poitTuristic added successfully'});
  })
  .catch(err => {
    res.status(409).send({'status': 'failure','mssg': 'unable to save to database'});
  });
});

// api to get PoitTuristic
poitTuristicRoutes.route('/').get(function (req, res) {
  PoitTuristic.find(function (err, PoitTuristic){
    if(err){
      res.status(400).send({'status': 'failure','mssg': 'Something went wrong'});
    }
    else {
      res.status(200).json({'status': 'success','': PoitTuristic});
    }
  });
});

poitTuristicRoutes.route('/poitTuristic/:name').get(function (req, res) {
  let name = req.params.name;
  
  PoitTuristic.find({ name: name }, function(err, PoitTuristic) {
    if (err) {
      // Tratar erros de busca no banco de dados
      res.status(500).send('Erro interno do servidor');
    } else if (PoitTuristic.length === 0) {
    
      res.status(404).send('Nenhum ponto encontrado');
    } else {
      
      res.status(200).json(PoitTuristic);
    }
  });
});

// api to get poitTuristic
poitTuristicRoutes.route('/poitTuristic/:id').get(function (req, res) {
  let ID = req.params.id;
  PoitTuristic.findById(ID, function (err, poitTuristic){
    if(err){
      res.status(400).send({'status': 'failure','mssg': 'Something went wrong'});
    }
    else {
      res.status(200).json({'status': 'success','poitTuristic': poitTuristic});
    }
  });
});

// api for delete
poitTuristicRoutes.route('/delete/:id').delete(function (req, res) {
  PoitTuristic.findByIdAndRemove({_id: req.params.id}, function(err,){
    if(err){
      res.status(400).send({'status': 'failure','mssg': 'Something went wrong'});
    }
    else {
      res.status(200).json({'status': 'success','mssg': 'Delete successfully'});
    }
  });
});

module.exports = poitTuristicRoutes;