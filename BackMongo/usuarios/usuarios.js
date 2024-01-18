const express = require('express');
const nodemailer = require('nodemailer'); //libreria de envio de correos
const router = express.Router();
const { generarCodigoRecuperacion } = require('../token'); //importa el codigo en donde se genera el token de 6 digitos
const Usuario = require('../Modelo/UsuarioModel');
const Rol = require('../Modelo/RolModel');
const mongoose = require('mongoose');
const moment = require('moment');


router.post('/registro', async (req, res) => {
    try {
      const { email, password, nombre, apellido } = req.body;
  
      // Verificar si el usuario ya está registrado en <link>MongoDB</link>
      const usuarioExistente = await Usuario.findOne({ email });
  
      if (usuarioExistente) {
        res.status(200).json({ message: 'El usuario está registrado' });
        return;
      }
  
      // Obtener la fecha actual en formato ISO y luego formatearla como "dd/mm/yyyy"
        const fechaRegistro = new Date().toLocaleDateString('es-ES');
  
      // Generar un código de verificación
      const tokenRecuperacion = generarCodigoRecuperacion(6);
  
      const idRol = "654cff8f9e5f0e93abff3f7f";
  
      // Crear un nuevo usuario con los datos proporcionados y los valores adicionales
      const usuarioNuevo = new Usuario({
        email,
        password,
        nombre,
        apellido,
        verificado: false,
        fecha_registro: moment(fechaRegistro, "DD/MM/YYYY").toDate(), // Convertir a objeto Date
        token_recuperacion: tokenRecuperacion, // Guardar el código de verificación
        rol: idRol // Referencia al ID del rol
      });
  
      // Guardar el nuevo usuario en <link>MongoDB</link>
      await usuarioNuevo.save();
       // Envía un correo al usuario
       const transporter = nodemailer.createTransport({
        "service": "gmail",
        "auth": {
          "type": "OAuth2",
          "user": "jhoynners.santaella15@gmail.com",
          "clientId": "1010470278484-d3rhqg8ouapd4b4qfsdhmbqt23tcvvrs.apps.googleusercontent.com",
          "clientSecret": "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",
          "refreshToken": "1//04ljE4rJJxtarCgYIARAAGAQSNwF-L9Irh5LyQ0iZvAgp11OKn2KvfLDP62qJ6WL8e6LjOTBO3mX841U0hht4jn4l97SJh1qwIMA"
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
        from: 'jhoynners.santaella15@gmail.com',
        to: email,
        subject: 'Verifica tu correo electrónico',
        html: htmlContent,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
            res.status(200).json({ message: 'Usuario guardado con éxito en Mongo' });
        }
    });
  
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ error: 'Ocurrió un error al registrar usuario' });
    }
  });

  router.post('/validado', async (req, res) => {
    try {
      const { email, codigoValidacion } = req.body;
  
      // Verificar si el correo electrónico y el código de validación coinciden
      const usuario = await Usuario.findOne({ email });
  
      if (usuario) {
        if (usuario.token_recuperacion === codigoValidacion) {
          // Actualizar el campo "verificado" del usuario a true y borrar el campo "token_recuperacion"
          await Usuario.updateOne(
            { _id: usuario._id },
            {
              $set: {
                verificado: true,
                token_recuperacion: null, // Borra el campo "token_recuperacion"
              },
            }
          );
  
          res.status(200).json({ message: 'Usuario validado correctamente' });
        } else {
          res.status(401).json({ error: 'Código de validación incorrecto' });
        }
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al validar el usuario:', error);
      res.status(500).json({ error: 'Ocurrió un error al validar el usuario' });
    }
  });



module.exports = router;
