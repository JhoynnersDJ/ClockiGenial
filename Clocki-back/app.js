const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const UsuariosRouter = require('./usuarios/usuarios');
const loginRouter = require('./login/login');
const actividadRouter = require('./actividad/actividad');
const proyectoRouter = require('./proyecto/proyecto');
const clienteRouter = require('./cliente/cliente');

const app = express();
const port = 7000;

app.use(cors());
app.use(bodyParser.json());

//Middleware para usuarios
app.use('/usuarios', UsuariosRouter);

//Middleware para Login
app.use('/login', loginRouter);

//Middleware para actividades
app.use('/actividad', actividadRouter);

//Middleware para proyectos
app.use('/proyecto', proyectoRouter);

//Middleware para clientes
app.use('/cliente', clienteRouter);

app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
