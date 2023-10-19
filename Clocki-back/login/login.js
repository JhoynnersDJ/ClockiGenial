const express = require('express');
const {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} = require('firebase/firestore');
const { sign } = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { db } = require('../database/firebase');
const { generarCodigoRecuperacion } = require('../token');
const router = express.Router();
const secretToken = "Hl*2l3c#Tl4&Rb2Dp!5s";

// Endpoint para iniciar sesión
router.post('/login', async (req, res) => {
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

    // Verificar si el usuario está marcado como "verificado"
    if (!user.verificado) {
      console.log('Inicio de sesión fallido: Usuario no verificado');
      res.status(401).json({ error: 'Usuario no verificado' });
      return;
    }

    // Obtener el ID de rol
    const rolReference = user.rol; // La referencia al documento de rol

    const rolSnapshot = await getDoc(rolReference);
    const id_rol = rolSnapshot.data().id_rol;

    // Obtener el ID del usuario
    const id_usuario = querySnapshot.docs[0].id;

    // Si las credenciales son correctas y el usuario está verificado, genera un JWT y devuélvelo al cliente
    const token = sign({ email }, secretToken, { expiresIn: '1h' });

    console.log('Inicio de sesión exitoso');

    // Construye la respuesta
    const response = {
      token,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.email,
      id_rol: id_rol,
      id_usuario
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Ocurrió un error al iniciar sesión' });
  }
});

// Endpoint para solicitar el restablecimiento de contraseña
router.post('/olvide-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Genera un código de recuperación de 6 números aleatorios
    const codigoRecuperacion = generarCodigoRecuperacion(6);

    // Guarda el código de recuperación en el campo 'token_recuperacion' del usuario en la base de datos
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      // Actualiza el documento del usuario con el nuevo código de recuperación
      await updateDoc(doc(usuariosRef, userId), {
        token_recuperacion: codigoRecuperacion,
      });

      // Crea un transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'omnitetgroup01@gmail.com',
          clientId: '753006295934-a5s4k797r91oqeo43j7srr548v715a78.apps.googleusercontent.com',
          clientSecret: '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',
          refreshToken: '1//04SN02pSPtZPUCgYIARAAGAQSNwF-L9IratxmpXieduedcXWRCIBDJLv9GLM1dgsWRzndFAwiujWnMqRasz20blw9hrput7ZB0LY',
        },
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
            .omnitime{
              color: #510DB6; /* Cambio de color para "OmniTime" */
            }
            p {
              color: #666;
              font-size: 14px; /* Tamaño de fuente reducido para el correo */
            }
            .purple-text {
              color: #510DB6; /* Color morado para el nombre */
              font-size: 18px; /* Tamaño de fuente más grande para el nombre */
            }
            .token-container {
              background-color: #666;
              color: #fff;
              padding: 10px;
              border-radius: 5px;
              font-size: 18px; /* Tamaño de fuente para el texto en el token */
              margin-top: 10px;
              text-align: center;
            }
            .token {
              font-size: 24px; /* Tamaño de fuente más grande para el token */
              font-weight: bold; /* Texto en negrita para el token */
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Bienvenido a <span class="omnitime">OmniTime</span></h1>
            <p>¡Gracias <span class="purple-text"></span> por registrarte en nuestro servicio! Esperamos que disfrutes de nuestra plataforma.</p>
            <p>Su código de verificación es:</p>
            <div class="token-container">
               <span class="token">${codigoRecuperacion}</span>
            </div>
          </div>
        </body>
      </html>
      `;
      // Configura el correo electrónico
      const mailOptions = {
        from: 'omnitetgroup01@gmail.com',
        to: email,
        subject: 'Restablecer contraseña',
        html: htmlContent,
      };

      // Envía el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          res.status(500).json({ error: 'Error al enviar el correo' });
        } else {
          console.log('Correo enviado:', info.response);
          res.status(200).json({ message: 'Correo enviado' });
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
router.post('/reset-password', async (req, res) => {
  try {
    const {token_recuperacion} = req.body; // Obtén el token desde el formulario
    const {nuevo_password} = req.body; // Obtén el nuevo password desde el formulario

    if (!token_recuperacion || !nuevo_password) {
      res.status(400).json({ error: 'Token y nuevo_password son campos requeridos' });
      return;
    }

    // Verifica si el token existe en la base de datos
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('token_recuperacion', '==', token_recuperacion));
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

module.exports = router;
