const express    = require('express');
const bodyParser = require('body-parser');

const models = require('./models');

const app = express();
app.use(bodyParser.json());

require('./routes')(app);

models.sequelize.sync().then(() => {
    console.log('[APP] Database initialized');
    app.emit('databaseInitialized');
});

module.exports = app;