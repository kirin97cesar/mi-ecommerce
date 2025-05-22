import { parametersGetAll } from '@domain/dto/parametersGetAll';
import { User } from '@domain/entities/User';

export interface UserRepository {
  getAll(parametersGetAll: parametersGetAll): Promise<{ data: User[], total: number, paginas: number, paginaActual: number }>;
}
