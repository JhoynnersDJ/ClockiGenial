const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, addDoc, doc,getDoc} = require('firebase/firestore');
const { sign } = require('jsonwebtoken');
const { db, firebase } = require('./database/firebase');
const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig'); // Importa la configuración

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
        // Envía un correo al usuario
        const transporter = nodemailer.createTransport({
            "service": "gmail",
            "auth": {
              "type": "OAuth2",
              "user": "omnitetgroup01@gmail.com",
              "clientId": "753006295934-a5s4k797r91oqeo43j7srr548v715a78.apps.googleusercontent.com",
              "clientSecret": "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",
              "refreshToken": "1//04SN02pSPtZPUCgYIARAAGAQSNwF-L9IratxmpXieduedcXWRCIBDJLv9GLM1dgsWRzndFAwiujWnMqRasz20blw9hrput7ZB0LY"
            }
          });

const htmlContent = `
<html>
  <head>
    <style>
      /* Estilos CSS personalizados */
      body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2; /* Cambio de color de fondo */
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px #f2f2f2;
      }
      h1 {
        font-size: 24px;
        margin-bottom: 10px; /* Espacio adicional después del título */
      }
      .omnitime {
        color: #510DB6; /* Cambio de color solo para "OmniTime" */
      }
      p {
        color: #666;
        font-size: 14px; /* Tamaño de fuente reducido para el correo */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Bienvenido a <span class="omnitime">OmniTime</span> falta modificar</h1>
      <p>¡Gracias por registrarte en nuestro servicio! Esperamos que disfrutes de nuestra plataforma.</p>
      <p>Tu dirección de correo es: ${email}</p>
    </div>
  </body>
</html>
`;


        // Configura el correo electrónico de verificación
    const mailOptions = {
        from: 'omnitetgroup01@gmail.com', // Cambia esto por tu dirección de correo
        to: email,
        subject: 'Verifica tu correo electrónico',
        html: htmlContent,
      };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
            } else {
                console.log('Correo enviado:', info.response);
            }
        });
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
