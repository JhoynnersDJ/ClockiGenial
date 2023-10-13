const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, addDoc, doc,getDoc, updateDoc} = require('firebase/firestore');
const { sign } = require('jsonwebtoken');
const { db, firebase } = require('./database/firebase');
const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig'); // Importa la configuración
const crypto = require('crypto');


const secretToken = "Hl*2l3c#Tl4&Rb2Dp!5s";

const app = express();
const port = 7000;

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


// Endpoint para solicitar el restablecimiento de contraseña
app.post('/olvide-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Genera un token seguro
    const token = crypto.randomBytes(20).toString('hex');

    // Guarda el token en el campo 'token_recuperacion' del usuario en la base de datos
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      // Actualiza el documento del usuario con el nuevo token de recuperación
      await updateDoc(doc(usuariosRef, userId), {
        token_recuperacion: token,
      });

      // Construye el enlace para el restablecimiento de contraseña
      const resetLink = `http://192.168.1.16:1111/auth/olvide-validado/${token}`;

      // Crea un transporte de correo
      const transporter = nodemailer.createTransport({
        "service": "gmail",
        "auth": {
          "type": "OAuth2",
          "user": "omnitetgroup01@gmail.com",
          "clientId": "753006295934-a5s4k797r91oqeo43j7srr548v715a78.apps.googleusercontent.com",
          "clientSecret": "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",
          "refreshToken": "1//04SN02pSPtZPUCgYIARAAGAQSNwF-L9IratxmpXieduedcXWRCIBDJLv9GLM1dgsWRzndFAwiujWnMqRasz20blw9hrput7ZB0LY"
        },
      });

      // Configura el correo electrónico
      const mailOptions = {
        from: 'omnitetgroup01@gmail.com',
        to: email,
        subject: 'Restablecer contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetLink}">${resetLink}</a></p>`,
      };

      // Envía el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          res.status(500).json({ error: 'Error al enviar el correo' });
        } else {
          console.log('Correo enviado:', info.response);
          res.status(200).json({ message: 'Correo enviado con éxito' });
        }
      });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al solicitar el restablecimiento de contraseña:', error);
    res.status(500).json({ error: 'Ocurrió un error al solicitar el restablecimiento de contraseña' });
  }
});

// Endpoint para restablecer la contraseña
app.get('/reset-password/:token', async (req, res) => {
  try {
    const token = req.params.token; // Obtén el token de la URL
    const {nuevo_password} = req.body; // Obtén el nuevo password de la consulta GET

    // Verifica si el token existe en la base de datos
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('token_recuperacion', '==', token));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      // Actualiza el campo 'password' con el nuevo password
      await updateDoc(doc(usuariosRef, userId), {
        password: nuevo_password,
        token_recuperacion: null, // Limpia el campo 'token_recuperacion'
      });

      res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } else {
      res.status(404).json({ error: 'Token no válido' });
    }
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Ocurrió un error al restablecer la contraseña' });
  }
});







app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
