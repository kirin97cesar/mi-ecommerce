import { AuthUseCases } from '@application/use-cases/AuthUseCases';
import { AuthRepository } from '@domain/repositories/AuthRepository';
import { IAuthService } from '@application/ports/auth'

import { Auth } from '@domain/entities/Auth';

describe('AuthUseCases', () => {
  let authRepository: jest.Mocked<AuthRepository>;
  let IAuthService: jest.Mocked<IAuthService>;
  let authUseCases: AuthUseCases;

  beforeEach(() => {
    authRepository = {
      findByUsername: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    IAuthService = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      hashPassword: jest.fn(),
      comparePassword: jest.fn((password: string, hashed: string) => true),
    };

    authUseCases = new AuthUseCases(IAuthService);
  });

  it('generate user and return token', async () => {

    IAuthService.generateToken.mockReturnValue('mocked-jwt-token');
    const result = await authUseCases.register('testuser', 'password', authRepository);
    expect(IAuthService.generateToken).toHaveBeenCalledWith('testuser');
    expect(result).toBe('mocked-jwt-token');
  });

  it('should authenticate user and return token', async () => {
    const mockUser: Auth = {
      username: 'testuser',
      password: 'password',
    };

    authRepository.findByUsername.mockResolvedValue(mockUser);
    IAuthService.generateToken.mockReturnValue('mocked-jwt-token');
    const result = await authUseCases.login('testuser', 'password', authRepository);
    expect(authRepository.findByUsername).toHaveBeenCalledWith('testuser');
    expect(IAuthService.generateToken).toHaveBeenCalledWith('testuser');
    expect(result).toBe('mocked-jwt-token');
  });
});
