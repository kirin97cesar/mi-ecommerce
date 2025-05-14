import { UserRepository } from '../../domain/repositories/UserRepository';

export class GetUsers {
  constructor(private userRepository: UserRepository) {}

  async getAll() {
    return await this.userRepository.getAll();
  }
}
