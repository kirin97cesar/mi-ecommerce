"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthUseCases_1 = require("@application/use-cases/AuthUseCases");
describe('AuthUseCases', () => {
    let authRepository;
    let IAuthService;
    let authUseCases;
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
            comparePassword: jest.fn((password, hashed) => true),
        };
        authUseCases = new AuthUseCases_1.AuthUseCases(IAuthService);
    });
    it('generate user and return token', async () => {
        IAuthService.generateToken.mockReturnValue('mocked-jwt-token');
        const result = await authUseCases.register('testuser', 'password', authRepository);
        expect(IAuthService.generateToken).toHaveBeenCalledWith('testuser');
        expect(result).toBe('mocked-jwt-token');
    });
    it('should authenticate user and return token', async () => {
        const mockUser = {
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
