import { User } from '../entities/User';

export interface UserRepository {
  getAll(): Promise<User[]>;
}
