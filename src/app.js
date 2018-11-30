const express    = require('express');
const bodyParser = require('body-parser');

const models = require('./models/index');

const app = express();
app.use(bodyParser.json());

require('./routes/routes_index')(app);

models.sequelize.sync().then(() => {
    console.log('[APP] Database initialized');
    app.emit('databaseInitialized');
});

module.exports = app;