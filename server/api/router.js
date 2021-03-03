const express = require('express');
const https = require('https');
const { saveScore, getUsers } = require('./controller');

const apiRouter = express.Router();

apiRouter.route('/save_score').put(saveScore);
apiRouter.route('/get_users').get(getUsers);

module.exports = apiRouter;
