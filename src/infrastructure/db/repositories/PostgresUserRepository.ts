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
    const parsedPagina = Number(pagina);
    const parsedLimite = Number(limite);

    const finalPagina = !isNaN(parsedPagina) && parsedPagina > 0 ? parsedPagina : 1;
    const finalLimite = !isNaN(parsedLimite) && parsedLimite > 0 ? parsedLimite : 10;

    const client = await this.getClient();
    const offset = (finalPagina - 1) * finalLimite;

    try {
      await client.query('BEGIN');

      const [countResult, result] = await Promise.all([
        this.executeQuery({ sql: UserQuery.COUNT_LIST_USER }),
        this.executeQuery({
          sql: `${UserQuery.LIST_USER} LIMIT $1 OFFSET $2`,
          params: [finalLimite, offset]
        })
      ]);

      const total = Number(countResult?.rows[0]?.total ?? 0);
      const paginas = Math.ceil(total / finalLimite);

      await client.query('COMMIT');

      return {
        data: result.rows,
        total,
        paginas,
        paginaActual: finalPagina
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      await this.closeConnection();
    }
  }
}
