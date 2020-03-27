const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const cors = require('cors');

const app = express();

app.use(logger('combined'));
app.use(express.json({type: 'application/*'}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

app.use('/', indexRouter);








// catch 404 errors
app.use((req, res) => {
  res.status(404).json({error: 'That endpoint does not exist.'});
});




module.exports = app;
