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

const app = express();
const port = process.env.port || 3000;
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "115",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
    },
  })
);

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
