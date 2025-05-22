import { parametersGetAll } from '@domain/dto/parametersGetAll';
import { UserRepository } from '@domain/repositories/UserRepository';


export class GetUsers {
  constructor(private userRepository: UserRepository) {}

  async getAll(parametersGetAll: parametersGetAll) {
    return await this.userRepository.getAll(parametersGetAll);
  }
}
