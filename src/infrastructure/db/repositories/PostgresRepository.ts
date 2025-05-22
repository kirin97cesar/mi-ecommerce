import { pool } from '@infrastructure/db/db.config';
import { SqlRepository } from '@domain/repositories/SqlRepository';
import { PoolClient } from 'pg';

export class PostgresRepository implements SqlRepository {
  private client?: PoolClient;

  public async getClient(): Promise<PoolClient> {
    if (!this.client) {
      this.client = await pool.connect();
    }
    return this.client;
  }

  public async closeConnection(): Promise<void> {
    if (this.client) {
      this.client.release();
      this.client = undefined;
    }
  }

  public async executeQuery({
    sql,
    params = {},
  }: {
    sql: string;
    params?: Record<string, any>;
  }): Promise<any> {
    const client = await this.getClient();

    const values: any[] = [];
    let index = 1;

    const parsedSql = sql.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => {
      const value = params[key];

      if (value === undefined) {
        throw new Error(`Falta el parámetro: ${key}`);
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          throw new Error(`El arreglo para el parámetro :${key} no puede estar vacío`);
        }
        const placeholders = value.map(() => `$${index++}`);
        values.push(...value);
        return placeholders.join(', ');
      } else {
        values.push(value);
        return `$${index++}`;
      }
    });

    // Log SQL con parámetros reales
    const debugSql = parsedSql.replace(/\$(\d+)/g, (_, idx) => {
      const val = values[Number(idx) - 1];
      return typeof val === 'string' ? `'${val}'` : String(val);
    });

    console.log('QUERY =>', debugSql);

    return client.query(parsedSql, values);
  }
}
