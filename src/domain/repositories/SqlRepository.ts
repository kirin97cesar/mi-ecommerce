import { PoolClient } from 'pg';

export interface SqlRepository {

  getClient(): Promise<PoolClient>;

  closeConnection(): Promise<void>;

  executeQuery(input: { sql: string; params?: any[] }): Promise<any>;
}
