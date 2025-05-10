import express from "express";
import session from "express-session";
import helmet from "helmet";
import cors from "cors";
import error from "./middlewares/error.js";
import { isAuthenticated } from "./middlewares/auth.js";
import routesUsuarios from "./routes/rUsuario.js";
import routesPublicaciones from "./routes/rPublicaciones.js";
import routesLike from "./routes/rLike.js";
import routesComentarios from "./routes/rComentarios.js";
import routesAmigos from "./routes/rAmigos.js";
import routesPeticiones from "./routes/rPeticiones.js";
import { createClient } from "redis";
import { RedisStore } from "connect-redis"; // Importación correcta de RedisStore
import dotenv from "dotenv";

dotenv.config(); // Cargar .env

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Redis
const redisClient = createClient({
  url: process.env.REDIS_URL, // Usa tu URL de Redis desde el archivo .env
});

redisClient.connect().catch(console.error);

// Crear el RedisStore con el cliente de Redis conectado
const RedisStoreInstance = new RedisStore({ client: redisClient });

// Middleware
app.use(
  cors({
    origin: "http://localhost:4200", // Asegúrate de que coincida con tu frontend
    credentials: true, // Permite el envío de cookies y cabeceras de autenticación
  })
);

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: RedisStoreInstance, // Usamos el RedisStore con el cliente de Redis
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      secure: true, // Cambiar a true en producción con HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    },
  })
);

// Rutas
app.use(routesUsuarios);
app.use(routesPublicaciones);
app.use(isAuthenticated, routesLike);
app.use(isAuthenticated, routesComentarios);
app.use(isAuthenticated, routesAmigos);
app.use(isAuthenticated, routesPeticiones);
app.use(error.e404);

app.listen(port, () => {
  console.log(`La aplicación está funcionando en http://localhost:${port}`);
});
