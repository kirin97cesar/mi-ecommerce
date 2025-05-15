import { UserRepository } from '@domain/repositories/UserRepository';
import { User } from '@domain/entities/User';
import { pool } from '@infrastructure/db/db.config';

export class PostgresUserRepository implements UserRepository {

  async getAll(): Promise<User[]> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query<User>('SELECT id, name, email FROM users');
      await client.query('COMMIT');
      return res.rows;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
