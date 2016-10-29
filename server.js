const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./config');
const User = require('./models/user.js');
const port = process.env.PORT || 4000;

mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', express.static(process.cwd() + '/public'));
app.use(morgan('dev'));

require('./routes/apiRoutes')(app, User);

app.listen(port, function () {
		console.log('Server up on port : ' + port);
});
