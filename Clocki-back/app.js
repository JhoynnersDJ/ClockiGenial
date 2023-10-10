const express = require('express');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const cors = require('cors');

const app = express();
const port = 8000;

// Configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
    apiKey: "AIzaSyBNXC-5ht7SpHD5NsAHX3yem4oZeU0jnis",
    authDomain: "dev-fusion-401517.firebaseapp.com",
    projectId: "dev-fusion-401517",
    storageBucket: "dev-fusion-401517.appspot.com",
    messagingSenderId: "868868796303",
    appId: "1:868868796303:web:45bfe97f58e7fabeaf25fa",
    measurementId: "G-YVM21V9KPW"
};

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Middleware CORS para permitir solicitudes desde otros servidores
app.use(cors());

// Ruta para el inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Autenticación de Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Envía un mensaje de bienvenida
        res.status(200).json({ message: `¡Bienvenido, ${user.email}!` });
    } catch (error) {
        // Manejar errores de autenticación
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
