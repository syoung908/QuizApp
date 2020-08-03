const config = require('./config');
const express = require('express');
const path = require('path'); 
const app = express();
var cors = require('cors');
app.use(cors());
const logger = require('morgan');
app.use(logger('dev'));

// Globals
const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, '/dist'); 
const HTML_FILE = path.join(DIST_DIR, 'index.html');

// Establish Database Connection
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = global.Promise;

const db = mongoose.connect(config.DBConnectionString, (err) => {
  if (err) console.error(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(DIST_DIR));

var apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(HTML_FILE)
});

app.listen(PORT, function() {
  console.log('Server listening on port: ' + PORT);
  console.log(`mode: ${process.env.NODE_ENV}`);
});

module.exports = app;