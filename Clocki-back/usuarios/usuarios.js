const express = require('express');
const { collection, doc, addDoc} = require('firebase/firestore');
const nodemailer = require('nodemailer');
const router = express.Router();
const { db } = require('../database/firebase');
const { generarCodigoRecuperacion } = require('../token');

router.post('/registro', async (req, res) => {
  try {
      const { email, password, nombre, apellido } = req.body;

      // Obtiene la fecha actual en formato ISO y luego la formatea como "dd/mm/yyyy"
      const fechaRegistro = new Date().toLocaleDateString('es-ES');
      
      // Genera un código de verificación
      const tokenRecuperacion = generarCodigoRecuperacion(6);
      
      const idRol = "ru11bY0aElvEO95acK6c";
      
      // Crea un nuevo usuario con los datos proporcionados y los valores adicionales
      const usuarioNuevo = {
          email,
          password,
          nombre,
          apellido,
          verificado: false,
          fecha_registro: fechaRegistro,
          token_recuperacion: tokenRecuperacion, // Guarda el código de verificación
          rol: doc(db, 'rol', idRol) // Referencia al documento del rol
      };

      // Guarda el nuevo usuario en Firestore
      const usuariosRef = collection(db, 'usuarios');
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
            <p>¡Gracias <span class="purple-text">${nombre}</span> por registrarte en nuestro servicio! Esperamos que disfrutes de nuestra plataforma.</p>
            <p>Su código de verificación es:</p>
            <div class="token-container">
               <span class="token">${tokenRecuperacion}</span>
            </div>
          </div>
        </body>
      </html>
      `;

      // Configura el correo electrónico de verificación
      const mailOptions = {
          from: 'omnitetgroup01@gmail.com',
          to: email,
          subject: 'Verifica tu correo electrónico',
          html: htmlContent,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
              console.error('Error al enviar el correo:', error);
          } else {
              console.log('Correo enviado:', info.response);
              res.status(200).json({ message: 'Usuario guardado con éxito en Firestore' });
          }
      });
  } catch (error) {
      console.error('Error al guardar el usuario en Firestore:', error);
      res.status(500).json({ error: 'Ocurrió un error al guardar el usuario' });
  }
});

module.exports = router;
