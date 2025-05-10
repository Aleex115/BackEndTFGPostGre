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
import { RedisStore } from "connect-redis"; // ✅ Named export, no default

import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

// ——— Middleware ———
app.use(
  cors({
    origin: ["http://localhost:4200", "https://image-hub-sigma.vercel.app"],
    credentials: true,
  })
);

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      secure: true, // Necesario para HTTPS en producción
      httpOnly: true,
      sameSite: "none", // Necesario para cross-origin en producción
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    },
  })
);

// ——— Rutas ———
app.use(routesUsuarios);
app.use(routesPublicaciones);
app.use(isAuthenticated, routesLike);
app.use(isAuthenticated, routesComentarios);
app.use(isAuthenticated, routesAmigos);
app.use(isAuthenticated, routesPeticiones);

// Middleware de error 404
app.use(error.e404);

// Arranque del servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
