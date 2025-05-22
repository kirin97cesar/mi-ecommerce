import { GetUsers } from '@application/use-cases/GetUsers';
import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';

describe('GetUsers use case', () => {
  it('should return a list of users', async () => {
    const mockUsers: User[] = [
      { id: 1, name: 'Juan', email: 'juan@example.com' },
      { id: 2, name: 'Ana', email: 'ana@example.com' },
    ];

    const mockRepo: UserRepository = {
      getAll: jest.fn().mockResolvedValue(mockUsers),
    };

    const getUsers = new GetUsers(mockRepo);
    const result = await getUsers.getAll({ limite: 10, pagina: 1});

    expect(result).toEqual(mockUsers);
    expect(mockRepo.getAll).toHaveBeenCalled();
  });
});
