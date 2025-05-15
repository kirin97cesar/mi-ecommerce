import { Auth } from '@domain/entities/Auth';

export interface AuthRepository {
  save({ username, password, token} : Auth): Promise<boolean>;
  findByUsername(username : string) : Promise<Auth | null>;
  update({ username, token }: Auth): Promise<boolean>;
}
