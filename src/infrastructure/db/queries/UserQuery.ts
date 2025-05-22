const BASE_USER = `FROM usuario u
INNER JOIN TipoUsuario tu
ON tu.idTipoUsuario = u.idTipoUsuario`;

export const UserQuery = {
    LIST_USER: `
    SELECT u.idusuario, u.nombres, u.apellidopaterno, u.apellidomaterno, tu.descripcion as rol, u.estado
    ${BASE_USER}
    WHERE TRUE
    `,
    FIND_USER: `AND u.idUsuario IN (:idUsuario)`,
    FIND_USER_STATE: `AND u.estado = :estado`,
    FIND_USER_ROL: `AND tu.idTipoUsuario IN (:idRol)`,
    FIND_USER_NOMBRES: `LOWER(u.nombresCompletos) ILIKE`,
    LIMIT: `LIMIT :limit OFFSET :offset`,
    COUNT_LIST_USER: `
    SELECT COUNT(1) as total ${BASE_USER}
    `
}