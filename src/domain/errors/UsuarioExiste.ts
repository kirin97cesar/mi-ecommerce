export class UsuarioYaExisteError extends Error {
    statusCode: number;
    code: string;
    params?: any;
  
    constructor(params?: any) {
      super("Usuario ya existe!");
      this.name = "UsuarioYaExisteError";
      this.statusCode = 409;
      this.params = params;
      this.code = "USUARIO_YA_EXISTE";
    }
  }
  