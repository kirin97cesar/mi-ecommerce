import { User } from '@domain/entities/User';

export interface UserRepository {
  getAll(): Promise<User[]>;
}
