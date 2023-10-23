const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const UsuariosRouter = require('./usuarios/usuarios');
const loginRouter = require('./login/login');
const actividadRouter = require('./actividad/actividad');
const proyectoRouter = require('./proyecto/proyecto');
const clienteRouter = require('./cliente/cliente');
const listaRouter = require('./lista/lista');
const { collection, getDocs, where, doc, getDoc, onSnapshot, query } = require('firebase/firestore');
const { db } = require('./database/firebase');

const app = express();
const port = 7000;
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());

// Middleware para usuarios
app.use('/usuarios', UsuariosRouter);

// Middleware para Login
app.use('/login', loginRouter);

// Middleware para actividades
app.use('/actividad', actividadRouter);

// Middleware para proyectos
app.use('/proyecto', proyectoRouter);

// Middleware para clientes
app.use('/cliente', clienteRouter);

// Middleware para lista
app.use('/lista', listaRouter);

// Configuración de socket.io para la comunicación en tiempo real
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Ruta para obtener actividades de un usuario y registros de tiempo de esas actividades con Socket.io
  app.get('/actividades-por-usuario/:id_usuario', async (req, res) => {
    try {
      const { id_usuario } = req.params;

      // Obtener actividades del usuario
      const actividadesRef = collection(db, 'actividades');
      const q = query(
        actividadesRef,
        where('usuario', '==', doc(db, 'usuarios', id_usuario))
      );

      const unsubscribeActividades = onSnapshot(q, (snapshot) => {
        const actividadesUsuario = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const id_actividad = doc.id;
          const {
            nombre_actividad,
            completado,
            duracion_total,
            proyecto,
            tarifa,
            fecha_registro,
            hora_registro
          } = data;

          let nombre_proyecto = null;

          if (proyecto) {
            const proyectoDocRef = proyecto;
            getDoc(proyectoDocRef)
              .then((proyectoDocSnapshot) => {
                if (proyectoDocSnapshot.exists()) {
                  nombre_proyecto = proyectoDocSnapshot.data().nombre_proyecto;
                }
                actividadesUsuario.push({
                  id_actividad,
                  nombre_actividad,
                  completado,
                  duracion_total,
                  proyecto,
                  tarifa,
                  fecha_registro,
                  hora_registro,
                  nombre_proyecto,
                });
              })
              .catch((error) => {
                console.error('Error al obtener el documento del proyecto:', error);
              });
          } else {
            actividadesUsuario.push({
              id_actividad,
              nombre_actividad,
              completado,
              duracion_total,
              proyecto,
              tarifa,
              fecha_registro,
              hora_registro,
              nombre_proyecto,
            });
          }
        });

        // Emitir los datos a través de Socket.io
        io.emit('actividadesPorUsuario', {
          id_usuario,
          actividadesUsuario,
          registrosTiempo,
        });

        // Console.log de la respuesta enviada a través de Socket.io
        console.log('Respuesta enviada a través de Socket.io:', {
          actividadesUsuario,
          registrosTiempo,
        });
      });

      // Obtener registros de tiempo de esas actividades
      const registrosTiempoRef = collection(db, 'registro_tiempo');
      const registrosTiempoQuerySnapshot = await getDocs(
        where('actividad', 'in', snapshot.docs.map(doc => doc.ref))
      );

      const registrosTiempo = registrosTiempoQuerySnapshot.docs.map(doc => {
        const data = doc.data();
        const { duracion, fecha, hora, actividad } = data;
        const id_actividad = actividad.id;
        return { id_actividad, duracion, fecha, hora };
      });

      // Respondemos a la solicitud HTTP
      res.status(200).json({
        actividadesUsuario,
        registrosTiempo,
      });

      // Detener la escucha cuando ya no es necesario
      unsubscribeActividades();
    } catch (error) {
      console.error('Error al obtener actividades y registros de tiempo:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener actividades y registros de tiempo' });
    }
  });
});

server.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
