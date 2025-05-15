export interface IAuthService {
    generateToken(userId: string): string;
    verifyToken(token: string): string | null;
    hashPassword(password: string): string;
    comparePassword(password: string, hashedPassword: string): boolean;
}