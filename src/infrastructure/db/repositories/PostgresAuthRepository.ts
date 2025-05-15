import { AuthRepository } from '@domain/repositories/AuthRepository';
import { Auth } from '@domain/entities/Auth';
import { pool } from '@infrastructure/db/db.config';

export class PostgresAuthRepository implements AuthRepository {
  
  async save({ username, password, token }: Auth): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO USUARIOS_TOKEN (correo, clave, token, fechaCreacion) VALUES ($1, $2, $3, NOW())`,
        [username, password, token]
      );
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async update({ username, token }: Auth): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `UPDATE USUARIOS_TOKEN SET token = $1, fechaModificacion = NOW() WHERE correo = $2`,
        [token, username]
      );
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async findByUsername(username: string): Promise<Auth | null> {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `SELECT correo as username, clave as password, token FROM USUARIOS_TOKEN WHERE correo = $1`,
        [username]
      );
      if (res.rowCount === 0) return null;
      return res.rows[0] as Auth;
    } catch (e) {
      throw e;
    } finally {
      client.release();
    }
  }
}
