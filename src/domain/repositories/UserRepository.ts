import { parametersGetAll } from '@domain/dto/parametersGetAllUser';
import { User } from '@domain/entities/User';

export interface UserRepository {
  getAll(parametersGetAll: parametersGetAll): Promise<{ data: User[], total: number, paginas: number, paginaActual: number }>;
  existsUser({ idTipoDocumento, numeroDocumento, idTipoUsuario  }: { idTipoDocumento: number, numeroDocumento: string, idTipoUsuario: number }) : Promise<Boolean>;
}
