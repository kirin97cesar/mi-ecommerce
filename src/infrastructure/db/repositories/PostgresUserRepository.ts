import { UserRepository } from '@domain/repositories/UserRepository';
import { PostgresRepository } from './PostgresRepository';
import { User } from '@domain/entities/User';
import { UserQuery } from '../queries/UserQuery';
import { parametersGetAll } from '@domain/dto/parametersGetAll';

export class PostgresUserRepository extends PostgresRepository implements UserRepository {

  public async getAll({ limite, pagina = 1, filtros }: parametersGetAll): Promise<{
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

      const sqlBase = [ UserQuery.LIST_USER ];
      const sqlBaseCount = [ UserQuery.COUNT_LIST_USER ];
      const params: any = {};

      if( filtros?.idUsuario ) {
        sqlBase.push( UserQuery.FIND_USER );
        sqlBaseCount.push(  UserQuery.FIND_USER );
        params.idUsuario = filtros?.idUsuario;
      }

      if( [true,false].includes(filtros?.estado) ) {
        sqlBase.push( UserQuery.FIND_USER_STATE );
        sqlBaseCount.push(  UserQuery.FIND_USER_STATE );
        params.estado = filtros?.estado;
      }

      if( filtros?.idRol ) {
        sqlBase.push( UserQuery.FIND_USER_ROL );
        sqlBaseCount.push(  UserQuery.FIND_USER_ROL );
        params.idRol = filtros?.idRol;
      }

      if (filtros?.nombres) {
        const palabras = filtros.nombres.trim().toLowerCase().split(/\s+/);
        const condiciones: string[] = [];
        palabras.forEach((palabra: string, i: number) => {
          const key = `nombrePalabra${i}`;
          condiciones.push(`${UserQuery.FIND_USER_NOMBRES} :${key}`);
          params[key] = `%${palabra}%`;
        });
      
        const sqlBusquedaNombre = `AND (${condiciones.join(' AND ')})`;
        sqlBase.push(sqlBusquedaNombre);
        sqlBaseCount.push(sqlBusquedaNombre);
      }

      if( limite ) {
        sqlBase.push( UserQuery.LIMIT );
        params.limit = finalLimite;
        params.offset = offset;
      }

      const [countResult, result] = await Promise.all([
        this.executeQuery({ 
          sql: sqlBaseCount.join(' '),
          params
        }),
        this.executeQuery({
          sql: sqlBase.join(' '),
          params
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
