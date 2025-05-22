export const UserQuery = {
    LIST_USER: `
    SELECT u.idusuario, u.nombres, u.apellidopaterno, u.apellidomaterno, tu.descripcion as rol, u.estado
    FROM usuario u
    INNER JOIN TipoUsuario tu
    ON tu.idTipoUsuario = u.idTipoUsuario
    `,
    COUNT_LIST_USER: `
    SELECT COUNT(1) as total FROM usuario u WHERE u.idTipoUsuario IS NOT NULL
    `
}