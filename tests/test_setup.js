const {sequelize} = require('../src/models');

beforeEach(async () => {
    await dropAndCreateTables();
});


async function dropAndCreateTables() {
    await sequelize.sync({
        force: true
    });
}
