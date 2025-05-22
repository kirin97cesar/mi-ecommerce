import { UserRepository } from '@domain/repositories/UserRepository';
import { PostgresRepository } from './PostgresRepository';
import { User } from '@domain/entities/User';
import { UserQuery } from '../queries/UserQuery';
import { parametersGetAll } from '@domain/dto/parametersGetAll';


export class PostgresUserRepository extends PostgresRepository implements UserRepository {

  public async getAll({ limite = 10, pagina = 1, filtros }: parametersGetAll): Promise<{
    data: User[];
    total: number;
    paginas: number;
    paginaActual: number;
  }> {
    pagina = pagina ? pagina :  1;
    limite = limite ? limite : 10;

    const client = await this.getClient();
    const offset = (pagina - 1) * limite;

    try {
      await client.query('BEGIN');

      const [countResult, result] = await Promise.all([
        this.executeQuery({ sql: UserQuery.COUNT_LIST_USER }),
        this.executeQuery({
          sql: `${UserQuery.LIST_USER} LIMIT $1 OFFSET $2`,
          params: [limite, offset]
        })
      ]);

      const total = Number(countResult.rows[0]?.total ?? 0);
      const paginas = Math.ceil(total / limite);

      await client.query('COMMIT');

      return {
        data: result.rows,
        total,
        paginas,
        paginaActual: pagina
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      await this.closeConnection();
    }
  }
}
