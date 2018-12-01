const UserGroupService = require('../../src/services/user_group_service');
const Models      = require('../../src/models/index');

function createGroup(groupName = "Group name") {
    return UserGroupService.createGroup({
        'name': groupName
    });
}

describe('The user group creation', () => {
    test('It should create new groups', (done) => {
        createGroup().then(group => {
            expect(group.id).toBeDefined();
            done();
        });

    });
});

describe('The user group collection', () => {
    test('It should show created groups', (done) => {
        Promise.all([
            createGroup("A"),
            createGroup("B"),
            createGroup("C")
        ]);

        UserGroupService.getAllGroups()
            .then(groups => {
                expect(groups.length).toBe(3);

                const names = groups.map(item => item.name);
                expect(names.indexOf("A")).not.toBe(-1);
                expect(names.indexOf("B")).not.toBe(-1);
                expect(names.indexOf("C")).not.toBe(-1);

                done();
            })

    });
});