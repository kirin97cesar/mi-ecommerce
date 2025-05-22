-- =======================
-- TABLAS DE SOPORTE
-- =======================

CREATE TABLE TipoDocumento (
    idTipoDocumento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE TipoUsuario (
    idTipoUsuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE MotivosBaja (
    idMotivoBaja INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    fechaCreacion TIMESTAMP,
    usuarioCreacion INT,
    estado BOOLEAN DEFAULT TRUE
);

-- =======================
-- USUARIO Y TOKEN
-- =======================

CREATE TABLE Usuario (
    idUsuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idTipoDocumento INT REFERENCES TipoDocumento(idTipoDocumento),
    numeroDocumento VARCHAR(20) UNIQUE,
    nombres VARCHAR(100),
    apellidoPaterno VARCHAR(100),
    apellidoMaterno VARCHAR(100),
    correo VARCHAR(150) UNIQUE,
    clave VARCHAR(255),
    telefono VARCHAR(20),
    idTipoUsuario INT REFERENCES TipoUsuario(idTipoUsuario),
    fechaCreacion TIMESTAMP,
    fechaModificacion TIMESTAMP,
    idMotivoBaja INT REFERENCES MotivosBaja(idMotivoBaja),
    estado BOOLEAN DEFAULT TRUE,
    usuarioCreacion INT,
    usuarioModificacion INT
);

CREATE TABLE Token (
    idToken INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUsuario INT REFERENCES Usuario(idUsuario),
    token VARCHAR(255) UNIQUE,
    tiempoLimite TIMESTAMP,
    fechaCreacion TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);

-- =======================
-- TIENDAS
-- =======================

CREATE TABLE Tienda (
    idTienda INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUsuario INT REFERENCES Usuario(idUsuario) UNIQUE,
    nombreComercial VARCHAR(100) NOT NULL,
    descripcion TEXT,
    logo VARCHAR(255),
    fechaCreacion TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);

-- =======================
-- DIRECCIONES
-- =======================

CREATE TABLE Direccion (
    idDireccion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUsuario INT REFERENCES Usuario(idUsuario),
    direccionTexto VARCHAR(255) NOT NULL,
    referencia VARCHAR(255),
    distrito VARCHAR(100),
    provincia VARCHAR(100),
    departamento VARCHAR(100),
    ubigeo VARCHAR(10),
    tipoDireccion VARCHAR(50),
    latitud NUMERIC(10,6),
    longitud NUMERIC(10,6),
    fechaCreacion TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);

-- =======================
-- CATEGORIAS Y PRODUCTOS
-- =======================

CREATE TABLE Categoria (
    idCategoria INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100),
    fechaCreacion TIMESTAMP,
    idUsuario INT REFERENCES Usuario(idUsuario),
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE Descuento (
    idDescuento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100),
    numeroCupon VARCHAR(50),
    porcentajeDescuento NUMERIC(5,2),
    precioDescuento NUMERIC(10,2),
    tiempoLimite TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP,
    fechaModificacion TIMESTAMP,
    idUsuario INT REFERENCES Usuario(idUsuario),
    usuarioModificacion INT
);

CREATE TABLE Producto (
    idProducto INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku VARCHAR(50) UNIQUE,
    descripcion VARCHAR(255),
    cantidad INT,
    precioUnitario NUMERIC(10,2),
    idDescuento INT REFERENCES Descuento(idDescuento),
    idUsuario INT REFERENCES Usuario(idUsuario),
    idTienda INT REFERENCES Tienda(idTienda),
    idDireccion INT REFERENCES Direccion(idDireccion),
    fechaCreacion TIMESTAMP,
    estadoPublicacion VARCHAR(50) DEFAULT 'pendiente'
);

CREATE TABLE ProductoCategoria (
    idProductoCategoria INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idProducto INT REFERENCES Producto(idProducto),
    idCategoria INT REFERENCES Categoria(idCategoria),
    estado BOOLEAN DEFAULT TRUE,
    idUsuario INT REFERENCES Usuario(idUsuario),
    UNIQUE (idProducto, idCategoria)
);

CREATE TABLE Talla (
    idTalla INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE ProductoTalla (
    idProductoTalla INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idProducto INT REFERENCES Producto(idProducto),
    idTalla INT REFERENCES Talla(idTalla),
    cantidadDisponible INT DEFAULT 0,
    UNIQUE (idProducto, idTalla)
);

-- =======================
-- ESTADO DE ENVÍO
-- =======================

CREATE TABLE EstadoEnvio (
    idEstadoEnvio INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

-- =======================
-- VENTAS Y PAGOS
-- =======================

CREATE TABLE Venta (
    idVenta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    montoTotal NUMERIC(10,2),
    fechaCreacion TIMESTAMP,
    idDescuento INT REFERENCES Descuento(idDescuento),
    idUsuario INT REFERENCES Usuario(idUsuario),
    idCalificacion INT,
    fechaModificacion TIMESTAMP,
    usuarioModificacion INT,
    idEstadoEnvio INT REFERENCES EstadoEnvio(idEstadoEnvio),
    idDireccionEnvio INT REFERENCES Direccion(idDireccion)
);

CREATE TABLE DetalleVenta (
    idDetalleVenta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idVenta INT REFERENCES Venta(idVenta),
    idProducto INT REFERENCES Producto(idProducto),
    precioVenta NUMERIC(10,2),
    cantidad INT,
    fechaCreacion TIMESTAMP,
    idDescuento INT REFERENCES Descuento(idDescuento),
    idUsuario INT,
    fechaModificacion TIMESTAMP,
    usuarioModificacion INT,
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE TipoPago (
    idTipoPago INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100),
    fechaCreacion TIMESTAMP,
    idUsuario INT,
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE DetallePago (
    idDetallePago INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idTipoPago INT REFERENCES TipoPago(idTipoPago),
    montoTotal NUMERIC(10,2),
    fechaCreacion TIMESTAMP,
    idUsuario INT,
    fechaModificacion TIMESTAMP,
    usuarioModificacion INT,
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE VentaPago (
    idVentaPago INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idVenta INT REFERENCES Venta(idVenta),
    idDetallePago INT REFERENCES DetallePago(idDetallePago)
);

-- =======================
-- ENCUESTAS Y CALIFICACIONES
-- =======================

CREATE TABLE Encuesta (
    idEncuesta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    estado BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP
);

CREATE TABLE Calificacion (
    idCalificacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idEncuesta INT REFERENCES Encuesta(idEncuesta),
    idUsuario INT REFERENCES Usuario(idUsuario),
    calificacionFinal NUMERIC(3,2),
    descripcion VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP
);

CREATE TABLE Preguntas (
    idPregunta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP
);

CREATE TABLE PreguntasEncuesta (
    idPreguntaEncuesta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idPregunta INT REFERENCES Preguntas(idPregunta),
    idEncuesta INT REFERENCES Encuesta(idEncuesta),
    respuesta TEXT
);

-- =======================
-- IMÁGENES
-- =======================

CREATE TABLE Imagen (
    idImagen INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ruta VARCHAR(255),
    idUsuario INT REFERENCES Usuario(idUsuario),
    fechaCreacion TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE ImagenProducto (
    idImagenProducto INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idProducto INT REFERENCES Producto(idProducto),
    idImagen INT REFERENCES Imagen(idImagen),
    fechaCreacion TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);


CREATE INDEX idx_producto_idusuario ON Producto(idUsuario);
CREATE INDEX idx_tienda_idusuario ON Tienda(idUsuario);
CREATE INDEX idx_direccion_idusuario ON Direccion(idUsuario);
