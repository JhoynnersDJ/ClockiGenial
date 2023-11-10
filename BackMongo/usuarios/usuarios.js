const express = require('express');
const nodemailer = require('nodemailer'); //libreria de envio de correos
const router = express.Router();
const { generarCodigoRecuperacion } = require('../token'); //importa el codigo en donde se genera el token de 6 digitos
const Usuario = require('../Modelo/UsuarioModel');
const Rol = require('../Modelo/RolModel');
const mongoose = require('mongoose');
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
        verificado: true,
        fecha_registro: fechaRegistro,
        token_recuperacion: tokenRecuperacion, // Guardar el código de verificación
        rol: idRol // Referencia al ID del rol
      });
  
      // Guardar el nuevo usuario en <link>MongoDB</link>
      await usuarioNuevo.save();
  
      res.status(200).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ error: 'Ocurrió un error al registrar usuario' });
    }
  });

module.exports = router;
