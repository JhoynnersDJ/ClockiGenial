const express = require('express');
const router = express.Router();
const Usuario = require('../Modelo/UsuarioModel');
const Rol = require('../Modelo/RolModel');


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

module.exports = router;
