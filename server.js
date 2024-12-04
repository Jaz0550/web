// Importar las librerías
const express = require("express"); // Facilita la creación de un servidor en Node.js.
const mysql = require("mysql2/promise");//Permite la conexión a MySQL.
const cors = require("cors"); //Habilita el acceso entre el frontend y el backend.

// Configurar Express
const app = express();
app.use(express.json()); //para que el servidor entienda los datos JSON
app.use(cors()); // permita el intercambio de datos entre el servidor y la página web.

// Configuración para servir imágenes desde una carpeta pública
app.use('/images', express.static('images')); // Sirve las imágenes desde la carpeta "images"

// Servir archivos HTML, CSS y JS desde la carpeta "public"
app.use(express.static("public"));


// Configurar la conexión a la base de datos
// Configurar la conexión a la base de datos (Usando async/await)
async function connectDB() {
    try {
        const conexion = await mysql.createConnection({
            host: "localhost",
            database: "datosmy",
            user: "root",
            password: "123456789"
        });
        console.log("Conectado a la base de datos");
        return conexion;
    } catch (err) {
        console.error("Error de conexión:", err);
        process.exit(1); // Terminar el proceso si no se puede conectar
    }
}

// Usar la conexión
connectDB().then((conexion) => {
    // Aquí colocas las rutas, por ejemplo:
    app.post("/guardar", (req, res) => {
        const { nombres, apellidos, correo, contrasena } = req.body;

        const sql = "INSERT INTO formu (nombre, apellido, correo, contrasena) VALUES (?, ?, ?, ?)";
        conexion.query(sql, [nombres, apellidos, correo, contrasena], (err, result) => {
            if (err) {
                console.error("Error al insertar datos:", err);
                res.status(500).send("Error al insertar datos en la base de datos");
            } else {
                res.send("Datos guardados exitosamente");
            }
        });
    });

// Crear una ruta para insertar los datos del formulario en la tabla formu
// Crear una ruta para insertar los datos del formulario en la tabla formu
app.post("/guardar", async (req, res) => {  // Usamos async/await
    const { nombres, apellidos, correo, contrasena } = req.body;

    const sql = "INSERT INTO formu (nombre, apellido, correo, contrasena) VALUES (?, ?, ?, ?)";
    
    try {
        // Usamos execute en lugar de query, y esperamos la respuesta con await
        const [result] = await conexion.execute(sql, [nombres, apellidos, correo, contrasena]);
        res.send("Datos guardados exitosamente");
    } catch (err) {
        console.error("Error al insertar datos:", err);
        res.status(500).send("Error al insertar datos en la base de datos");
    }
});


// Ruta para validar si el usuario existe
app.post("/validarUsuario", async (req, res) => {
    const { id, nombre, apellido } = req.body;

    const sql = "SELECT idformu, nombre, apellido FROM formu WHERE idformu = ? AND nombre = ? AND apellido = ?";

    try {
        // Ejecutamos la consulta con execute() y esperamos la respuesta
        const [result] = await conexion.execute(sql, [id, nombre, apellido]);

        if (result.length > 0) {
            res.json({ existe: true, usuario: result[0] }); // Devuelve los datos del usuario
        } else {
            res.json({ existe: false });
        }
    } catch (err) {
        console.error("Error al verificar usuario:", err);
        res.status(500).json({ existe: false });
    }
});


// Nueva ruta para obtener los paquetes de la base de datos
app.get("/paquetes", async (req, res) => {
    const sql = "SELECT id, nombre, precio, descripcion, cantidad_disponible, imagen FROM paquetes";

    try {
        // Ejecutamos la consulta con execute() y esperamos la respuesta
        const [results] = await conexion.execute(sql);

        res.json(results); // Devuelve los paquetes con sus precios y cantidades disponibles
    } catch (err) {
        console.error("Error al obtener paquetes:", err);
        res.status(500).send("Error al obtener paquetes");
    }
});


// Ruta para obtener un paquete por ID
app.get("/paquetes/:id", async (req, res) => {
    const paqueteId = parseInt(req.params.id);
    const sql = "SELECT * FROM paquetes WHERE id = ?";

    try {
        // Ejecutamos la consulta con execute() y esperamos la respuesta
        const [results] = await conexion.execute(sql, [paqueteId]);

        if (results.length === 0) {
            res.status(404).send({ error: "Paquete no encontrado" });
        } else {
            res.json(results[0]); // Devuelve el paquete encontrado
        }
    } catch (err) {
        console.error("Error al obtener el paquete:", err);
        res.status(500).send({ error: "Error en la base de datos" });
    }
});

app.post('/reservarPaquete', async (req, res) => {
    const { paqueteId, cantidadSeleccionada } = req.body;

    try {
        // Verificar la cantidad disponible
        const [paquete] = await conexion.execute('SELECT cantidad_disponible FROM paquetes WHERE id = ?', [paqueteId]);

        if (paquete.length === 0) {
            return res.status(404).send('Paquete no encontrado.');
        }

        if (paquete[0].cantidad_disponible < cantidadSeleccionada) {
            return res.status(400).send('Cantidad insuficiente en el paquete.');
        }

        // Actualizar la cantidad disponible
        await conexion.execute('UPDATE paquetes SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?', [cantidadSeleccionada, paqueteId]);

        res.send('Cantidad actualizada exitosamente.');
    } catch (error) {
        console.error('Error al actualizar la cantidad:', error);
        res.status(500).send('Error al procesar la reserva.');
    }
});

app.post('/registrarReserva', async (req, res) => {
    const { idformu, nombre, apellido, paqueteId, cantSeleccionada } = req.body;

    try {
        // Obtener el nombre del paquete
        const [paquete] = await conexion.execute('SELECT nombre FROM paquetes WHERE id = ?', [paqueteId]);
        if (paquete.length === 0) {
            return res.status(404).send('Paquete no encontrado.');
        }

        // Insertar en la tabla agendar
        await conexion.execute(
            'INSERT INTO agendar (idformu, nombre, apellido, paquete, cant_seleccionada) VALUES (?, ?, ?, ?, ?)', 
            [idformu, nombre, apellido, paquete[0].nombre, cantSeleccionada]
        );
        
        res.send('Reserva registrada exitosamente.');
    } catch (error) {
        console.error('Error al registrar la reserva:', error);
        res.status(500).send('Error al registrar la reserva.');
    }
});

app.get("/obtenerUsuario/:idformu", async (req, res) => {
    const idformu = req.params.idformu;

    try {
        // Realizar la consulta a la base de datos
        const [results] = await conexion.execute("SELECT nombre, apellido FROM formu WHERE idformu = ?", [idformu]);

        if (results.length > 0) {
            res.json(results[0]); // Devuelve el nombre y apellido como JSON
        } else {
            res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        res.status(500).send("Error al obtener los datos del usuario");
    }
});

app.post("/api/citas", async (req, res) => {
    const { idformu, nombre, apellido } = req.body;

    //console.log("Datos recibidos:", { idformu, nombre, apellido });

    const sql = "SELECT * FROM agendar WHERE idformu = ? AND nombre = ? AND apellido = ?";

    try {
        const [rows] = await conexion.execute(sql, [idformu, nombre, apellido]);
       // console.log("Resultados de la consulta:", rows);

        res.json(rows.length > 0 ? rows : []); 
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).send("Error al obtener las citas");
    }
});

//Segun para eliminar
app.delete("/api/eliminar", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send("ID de cita no proporcionado.");
    }

    // Consultar la cita antes de eliminarla
    const selectSQL = "SELECT * FROM agendar WHERE id = ?";
    const deleteSQL = "DELETE FROM agendar WHERE id = ?";
    const insertSQL = `
        INSERT INTO citascancel (idetiqueta, idformu, nombre, apellido, paquete, cant_seleccionada)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        // Iniciar transacción
        await conexion.query("START TRANSACTION");

        // Obtener los datos de la cita
        const [rows] = await conexion.execute(selectSQL, [id]);
        if (rows.length === 0) {
            return res.status(404).send("No se encontró la cita para eliminar.");
        }
        const cita = rows[0];

        // Insertar los datos en citascancel
        await conexion.execute(insertSQL, [
            cita.id,
            cita.idformu,
            cita.nombre,
            cita.apellido,
            cita.paquete,
            cita.cant_seleccionada,
        ]);

        // Eliminar la cita de agendar
        await conexion.execute(deleteSQL, [id]);

        // Confirmar transacción
        await conexion.query("COMMIT");
        res.send("Cita movida a la tabla citascancel y eliminada de agendar.");
    } catch (error) {
        // Revertir cambios si hay un error
        await conexion.query("ROLLBACK");
        console.error("Error al eliminar cita:", error);
        res.status(500).send("Error al eliminar la cita.");
    }
});

//Citas canceladas
app.get("/api/citas-canceladas", async (req, res) => {
    try {
        const [rows] = await conexion.execute("SELECT * FROM citascancel");
        res.json(rows); // Enviar los datos al cliente como JSON.
    } catch (error) {
        console.error("Error al obtener las citas canceladas:", error);
        res.status(500).send("Error al obtener las citas canceladas.");
    }
});

   // Configurar el puerto y escuchar solicitudes
   const PORT = 3000;
   app.listen(PORT, () => {
       console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
   });
});