import { IAuthService } from '../ports/auth';

export class AuthUseCases {
  constructor(private authService: IAuthService) {}

  async register(username: string, password: string, userRepo: any) {

    const hashedPassword = this.authService.hashPassword(password);

    const token = await this.authService.generateToken(username);
    await userRepo.save({ username, password: hashedPassword, token });
    return token;
  }

  async login(username: string, password: string, userRepo: any) {
    const user = await userRepo.findByUsername(username);
    if (!user) throw new Error('Usuario no encontrado');

    const valid = this.authService.comparePassword(password, user.password);
    if (!valid) throw new Error('Contraseña incorrecta');
    const token = this.authService.generateToken(username);
    await userRepo.update({ username, token });
    return token;
  }
}