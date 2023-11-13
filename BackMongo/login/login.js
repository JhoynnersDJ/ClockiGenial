const express = require('express');
const router = express.Router();
const Usuario = require('../Modelo/UsuarioModel');
const Rol = require('../Modelo/RolModel');
const { generarCodigoRecuperacion } = require('../token'); //importa el codigo en donde se genera el token de 6 digitos
const nodemailer = require('nodemailer'); //libreria de envio de correos


const jwt = require('jsonwebtoken');
const secretToken = "Hl*2l3c#Tl4&Rb2Dp!5s";


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Inicio de sesión fallido: Faltan credenciales');
      res.status(401).json({ error: 'Credenciales incompletas' });
      return;
    }

    // Buscar el usuario en la base de datos <link>MongoDB</link>
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log('Inicio de sesión fallido: Correo electrónico no encontrado');
      res.status(401).json({ error: 'Credenciales incorrectas' });
      return;
    }

    // Verificar la contraseña
    if (usuario.password !== password) {
      console.log('Inicio de sesión fallido: Contraseña incorrecta');
      res.status(401).json({ error: 'Credenciales incorrectas' });
      return;
    }

    // Verificar si el usuario está marcado como "verificado"
    if (!usuario.verificado) {
      console.log('Inicio de sesión fallido: Usuario no verificado');
      res.status(401).json({ error: 'Usuario no verificado' });
      return;
    }

    // Obtener el ID de rol
    const rol = await Rol.findById(usuario.rol);

    if (!rol) {
      console.log('Inicio de sesión fallido: Rol no encontrado');
      res.status(401).json({ error: 'Credenciales incorrectas' });
      return;
    }

    // Generar el token JWT
    const token = jwt.sign({ email }, secretToken, { expiresIn: '1h' });

    console.log('Inicio de sesión exitoso');

    // Construir la respuesta
    const response = {
      token,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.email,
      id_rol: rol.id_rol,
      id_usuario: usuario._id
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Ocurrió un error al iniciar sesión' });
  }
});


router.post('/olvide-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Genera un código de recuperación de 6 números aleatorios
    const codigoRecuperacion = generarCodigoRecuperacion(6);

    // Actualiza el campo 'token_recuperacion' del usuario en la base de datos
    const usuario = await Usuario.findOneAndUpdate(
      { email },
      { $set: { token_recuperacion: codigoRecuperacion } },
      { new: true }
    );

    if (usuario) {
      // Crea un transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'omnitetgroup01@gmail.com',
          clientId: '575477209031-niavpn9mig2oejbnn3h451b2m1p117p5.apps.googleusercontent.com',
          clientSecret: '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',
          refreshToken: '1//04VsXQh_Zg21NCgYIARAAGAQSNwF-L9IrLdeQlToiBp4juzfc6hnUHFrC0vFAiRVtjepqCWWlZ4YFNJcPvb3KeOwUwfUHzlcAljg',
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
          <p>¡Hola <span class="purple-text">${usuario.nombre}</span>!</p>
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en OmniTime. Por favor, utiliza el siguiente código de verificación para completar el proceso:</p>
          <div class="token-container">
            <span class="token">${codigoRecuperacion}</span>
          </div>
          <p>Si no has solicitado este cambio, por favor, ignora este mensaje.</p>
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

router.post('/reset-password', async (req, res) => {
  try {
    const { token_recuperacion, nuevo_password } = req.body; // Obtén el token y el nuevo password desde el formulario

    if (!token_recuperacion || !nuevo_password) {
      res.status(400).json({ error: 'Token y nuevo_password son campos requeridos' });
      return;
    }

    // Verifica si el token existe en la base de datos
    const usuario = await Usuario.findOne({ token_recuperacion });

    if (usuario) {
      // Actualiza el campo 'password' con el nuevo password y limpia el campo 'token_recuperacion'
      usuario.password = nuevo_password;
      usuario.token_recuperacion = null;
      await usuario.save();

      res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } else {
      res.status(400).json({ error: 'Token no válido' });
    }
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Ocurrió un error al restablecer la contraseña' });
  }
});


module.exports = router;
