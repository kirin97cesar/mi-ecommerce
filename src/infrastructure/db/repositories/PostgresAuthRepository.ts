import { AuthRepository } from '@domain/repositories/AuthRepository';
import { Auth } from '@domain/entities/Auth';
import { AuthQuery } from '@infrastructure/db/queries/AuthQuery';
import { PostgresRepository } from './PostgresRepository';

export class PostgresAuthRepository extends PostgresRepository implements AuthRepository {


  async save({ username, password, token }: Auth): Promise<boolean> {
    const client = await this.getClient();

    try {
      await client.query('BEGIN');
      await this.executeQuery({
        sql: AuthQuery.INSERT_USER_TOKEN, 
        params: [username, password, token]
      });
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      await this.closeConnection();
    }
  }

  async update({ username, token }: Auth): Promise<boolean> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      await this.executeQuery({
        sql: AuthQuery.UPDATE_USER_TOKEN, 
        params: [token, username]
      });
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      await this.closeConnection();
    }
  }

  async findByUsername(username: string): Promise<Auth | null> {
    const client = await this.getClient();
    try {
      const res = await this.executeQuery({
        sql: AuthQuery.FIND_USER, 
        params: [username]
      });
      if (res.rowCount === 0) return null;
      return res.rows[0] as Auth;
    } catch (e) {
      throw e;
    } finally {
      await this.closeConnection();
    }
  }
}
