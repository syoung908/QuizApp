const quizModel = require('../models/quizModel');
const questionModel = require('../models/questionModel');
const config = require('../../config');
var fs = require('fs');

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = global.Promise;

const db = mongoose.connect(config.DBConnectionString, (err) => {
  if (err) console.error(err);
});

let json = fs.readFileSync()


