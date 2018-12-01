const UserGroupService = require('../../src/services/user_group_service');
const UserGroupHelper  = require('../helpers/user_groups_helper');

describe('The user group creation', () => {
    test('It should create new groups', async () => {
        const group = await UserGroupHelper.createGroup();

        expect(group.id).toBeDefined();
    });
});

describe('The user group collection', () => {
    test('It should show created groups', async () => {

        await UserGroupHelper.createGroup("A");
        await UserGroupHelper.createGroup("B");
        await UserGroupHelper.createGroup("C");

        const groups = await UserGroupService.getAllGroups();

        expect(groups.length).toBe(3);

        const names = groups.map(item => item.name);
        expect(['A', 'B', 'C'].every(name => names.indexOf(name) > -1)).toBe(true);

    });

    test('It should return an empty array when there are no groups', async () => {
        const groups = await UserGroupService.getAllGroups();

        expect(groups.length).toBe(0);
    })
});