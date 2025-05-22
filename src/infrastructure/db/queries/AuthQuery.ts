export const AuthQuery = {
    INSERT_USER_TOKEN: `INSERT INTO USUARIOS_TOKEN (correo, clave, token, fechaCreacion) VALUES ($1, $2, $3, NOW())`,
    UPDATE_USER_TOKEN: `UPDATE USUARIOS_TOKEN SET token = $1, fechaModificacion = NOW() WHERE correo = $2`,
    FIND_USER: `SELECT correo as username, clave as password, token FROM USUARIOS_TOKEN WHERE correo = $1`,
}