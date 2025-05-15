import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { IAuthService } from '@application/ports/auth';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRATION: any = process.env.JWT_EXPIRATION || '1h';

export class AuthServiceImpl implements IAuthService {
  generateToken(userId: string): string {
    const payload = { userId };
    const options: SignOptions = {
      expiresIn: JWT_EXPIRATION,
    };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  verifyToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch {
      return null;
    }
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
