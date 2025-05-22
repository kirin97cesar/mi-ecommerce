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

  public async executeQuery({ sql, params = [] }: { sql: string; params?: any[] }): Promise<any> {
    const client = await this.getClient();

    let debugSql = sql;
    if (params.length > 0) {
      params.forEach((param, index) => {
        const safeValue = typeof param === 'string' ? `'${param}'` : param;
        debugSql = debugSql.replace(new RegExp(`\\$${index + 1}\\b`, 'g'), String(safeValue));
      });
    }

    console.log('QUERY =>', debugSql);

    return client.query(sql, params);
  }
}
