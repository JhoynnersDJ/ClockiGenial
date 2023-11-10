const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRouter = require('./login/login');
const listaRouter = require('./lista/lista');
const UsuariosRouter = require('./usuarios/usuarios');

const mongoose = require('mongoose');



const app = express();
const port = 7000;

// Conexión a la base de datos Omniservices
const uri = "mongodb+srv://jhoysantaella15:Melon24@cluster0.zrpgq2r.mongodb.net/ClockyGenial?retryWrites=true&w=majority";
mongoose.connect(uri) 
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error en la conexión a la base de datos:', error);
  });

app.use(cors());
app.use(bodyParser.json());


// Middleware para usuarios
app.use('/usuarios', UsuariosRouter);
// Middleware para Login
app.use('/login', loginRouter);
// Middleware para lista
app.use('/lista', listaRouter);

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
