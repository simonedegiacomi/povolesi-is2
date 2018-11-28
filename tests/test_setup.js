const {sequelize} = require('../src/models/index');

beforeEach(() => {
    dropAndCreateTables();
    importTestData();
});


function dropAndCreateTables() {
    sequelize.sync({sync: true});
}

function importTestData () {
    // TODO: Implement
}