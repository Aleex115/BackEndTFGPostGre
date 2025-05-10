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

const client = createClient({
  url: process.env.REDIS_URL,
});

client.connect().catch(console.error);

const RedisStoreInstance = new RedisStore({ client });

// Middleware
app.use(
  cors({
    origin: ["http://localhost:4200", "https://image-hub-sigma.vercel.app"], // Sin la barra al final
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
    resave: true,
    saveUninitialized: false,
    cookie: {
      path: "/",
      secure: process.env.NODE_ENV === "production", // ✅ Asegura que en producción la cookie sea HTTPS-only
      httpOnly: true,
      sameSite: "lax", // Opcional pero recomendado para sesiones
      maxAge: 1000 * 60 * 60 * 24 * 7,
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
