const express = require('express');

const models = require('./models');

const app  = express();
const PORT = process.env.PORT || 3000;

require('./routes')(app);

models.sequelize.sync().then(() => {
    console.log('[APP] Database initialized');

    app.listen(PORT, () => console.log(`[APP] Listening on port ${PORT}`));
});