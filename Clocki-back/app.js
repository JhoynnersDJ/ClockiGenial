const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Importa el middleware body-parser

const app = express();
const port = 8000;

// Middleware CORS para permitir solicitudes desde otros servidores
app.use(cors());

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

// Importa la instancia de Firebase y Firestore
const { db } = require('./database/firebase');

// Endpoint para guardar correo electrónico y contraseña en Firestore
app.post('/registro', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Guarda el correo electrónico y la contraseña en Firestore
        const userSave = db.collection('usuarios');
        await userSave.add({
            email,
            password
        });

        res.status(200).json({ message: 'Usuario guardado con éxito en Firestore' });
    } catch (error) {
        console.error('Error al guardar el usuario en Firestore:', error);
        res.status(500).json({ error: 'Ocurrió un error al guardar el usuario' });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
