const express = require('express');
/* eslint-disable */
const router = express.Router();
/* eslint-enable */
const axios = require('axios');
const logger = require('../lib/util').logger;

const authUrl = process.env.HUMAN_API_URL;

/* GET index route */
router.get('/humanApiSessionService', (req, res) => {
  res.status(200).json({title: 'Human API Service'});
});

/* GET index route */
router.post('/humanApiSessionService', async (req, res) => {
  const {body} = req;

  logger.info(`Request Body: ${JSON.stringify(body)}`);

  if (!body.userid) {
    res.status(500).json({Error: 'UserID Required'});
    return;
  }
  if (!body.email) {
    res.status(500).json({Error: 'Email Required'});
    return;
  }

  const requestBody = {
    client_id: '67cd14d199af2b25211b04bfca252acfd29be3a0',
    client_user_id: `${body.userid}`,
    client_user_email: `${body.email}`,
    client_secret: 'd7d1416908cedfb4f1083778d4a0890cea31435a',
    type: 'session',
  };

  let response;

  try {
    logger.info(authUrl, requestBody);
    response = await axios.post(authUrl, requestBody);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
