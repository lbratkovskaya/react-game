const express        = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser     = require('body-parser');
const apiRouter = require('./api/router');
const app            = express();

const PORT = process.env.PORT || 3000;

const CORS = {
  origin: 'http://localhost:9000',
  credentials: true,
};

const url = "mongodb+srv://dbuser:dbpassword@cluster0.jybfn.mongodb.net/react-game?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
  if (err) {
    throw err;
  } 
});

app
.use(cors(CORS))
.use(bodyParser.json())
.use('/api', apiRouter)
.listen(PORT);