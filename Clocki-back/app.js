const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const UsuariosRouter = require('./usuarios/usuarios');
const loginRouter = require('./login/login');

const app = express();
const port = 7000;

app.use(cors());
app.use(bodyParser.json());

//Middleware para usuarios
app.use('/usuarios', UsuariosRouter);

//Middleware para Login
app.use('/login', loginRouter);
   

app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
