const {User} = require('../../src/models/index');
const UserService = require('../../src/services/user_service');

module.exports = {
    async insertMario() {
        return await UserService.registerUser({
            name: 'Mario Rossi',
            password: 'password',
            email: 'mario@rossi.it',
            badgeNumber: '000001'
        });
    },


    async insertGiorgio() {
        return await UserService.registerUser({
            name: 'Giorgio Segalla',
            password: '112hhiufsk1',
            email: 'giorgio@segalla.it',
            badgeNumber: '187633'
        });
    },

    async insertNewRandom() {
        const number = Math.round(Math.random() * 1000000);
        return await UserService.registerUser({
            name: `Random ${number}`,
            password: 'password',
            email: `mario${number}@rossi.it'`,
            badgeNumber: `${number}`
        });
    },

    async findUserInDb(id) {
        return await User.findOne({
            where: {id}
        });
    },

    async expectUserToExist(id) {
        const user = await this.findUserInDb(id);

        expect(user).not.toBeNull();
    }
};