const app = require('./app');
const { logger } = require('./lib/util');
require('dotenv').config();
const port = process.env.PORT || 8000;

app.listen(port, logger.info(`CB Notifier listening on port ${port}.`));
