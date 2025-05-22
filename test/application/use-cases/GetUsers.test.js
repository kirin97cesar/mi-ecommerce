"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetUsers_1 = require("@application/use-cases/GetUsers");
describe('GetUsers use case', () => {
    it('should return a list of users', async () => {
        const mockUsers = [
            { id: 1, name: 'Juan', email: 'juan@example.com' },
            { id: 2, name: 'Ana', email: 'ana@example.com' },
        ];
        const mockRepo = {
            getAll: jest.fn().mockResolvedValue(mockUsers),
        };
        const getUsers = new GetUsers_1.GetUsers(mockRepo);
        const result = await getUsers.getAll({ limite: 10, pagina: 1 });
        expect(result).toEqual(mockUsers);
        expect(mockRepo.getAll).toHaveBeenCalled();
    });
});
