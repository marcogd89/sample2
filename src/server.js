const app = require('./app');
const { logger } = require('./lib/util');

const port = process.env.PORT || 8000;

app.listen(port, logger.info(`HUMAN API listening on port ${port}.`));
