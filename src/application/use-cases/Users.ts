import { parametersGetAll } from '@domain/dto/parametersGetAllUser';
import { parametersSaveUser } from '@domain/dto/parametersSaveUser';
import { UsuarioYaExisteError } from '@domain/errors/UsuarioExiste';
import { UserRepository } from '@domain/repositories/UserRepository';


export class Users {
  constructor(private userRepository: UserRepository) {}

  async getAll(parametersGetAll: parametersGetAll) {
    return await this.userRepository.getAll(parametersGetAll);
  }

  async save(parametersSaveUser: parametersSaveUser) {
    const { idTipoUsuario, idTipoDocumento, numeroDocumento } = parametersSaveUser;
    const existsUser = await this.userRepository.existsUser({ idTipoUsuario, idTipoDocumento, numeroDocumento });
    if (Boolean(existsUser)) throw new UsuarioYaExisteError(parametersSaveUser);
    return { message: 'Usuario creado!'}
  }
}
