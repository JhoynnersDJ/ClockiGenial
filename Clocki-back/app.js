const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, addDoc, doc,getDoc} = require('firebase/firestore');
const { sign } = require('jsonwebtoken');

const { db, firebase } = require('./database/firebase');

const secretToken = "Hl*2l3c#Tl4&Rb2Dp!5s";

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint para guardar correo electrónico y contraseña en Firestore
app.post('/registro', async (req, res) => {
    try {
        const { email, password, nombre, apellido } = req.body;

        // Obtiene la fecha actual en formato ISO y luego la formatea como "dd/mm/yyyy"
        const fechaRegistro = new Date().toLocaleDateString('es-ES');
        const tokenRecuperacion = null;
        const idRol = "ru11bY0aElvEO95acK6c"
        // Crea un nuevo usuario con los datos proporcionados y los valores adicionales
        const usuarioNuevo = {
            email,
            password,
            nombre,
            apellido,
            verificado: true,
            fecha_registro: fechaRegistro,
            token_recuperacion: tokenRecuperacion,
            rol: doc(db, 'rol', idRol) // Referencia al documento del rol
        };

        // Guarda el nuevo usuario en Firestore
        const usuariosRef = collection(db, 'usuarios'); // Utiliza collection aquí
        await addDoc(usuariosRef, usuarioNuevo);

        res.status(200).json({ message: 'Usuario guardado con éxito en Firestore' });
    } catch (error) {
        console.error('Error al guardar el usuario en Firestore:', error);
        res.status(500).json({ error: 'Ocurrió un error al guardar el usuario' });
    }
});

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Inicio de sesión fallido: Faltan credenciales');
            res.status(401).json({ error: 'Credenciales incompletas' });
            return;
        }

        // Validar si el email existe en la base de datos Firestore
        const usersRef = collection(db, 'usuarios');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('Inicio de sesión fallido: Correo electrónico no encontrado');
            res.status(401).json({ error: 'Credenciales incorrectas' });
            return;
        }

        // El email existe en la base de datos, ahora verifica la contraseña
        const user = querySnapshot.docs[0].data();

        if (user.password !== password) {
            console.log('Inicio de sesión fallido: Contraseña incorrecta');
            res.status(401).json({ error: 'Credenciales incorrectas' });
            return;
        }

        // Si las credenciales son correctas, genera un JWT y devuélvelo al cliente
        const token = sign({ email }, secretToken, { expiresIn: '1h' });

        console.log('Inicio de sesión exitoso');
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Ocurrió un error al iniciar sesión' });
    }
});

app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
