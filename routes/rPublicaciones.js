import { Router } from "express";
import cPublicaciones from "../controllers/cPublicaciones.js";
import { isAuthenticated } from "../middlewares/auth.js";

let routes = Router();

routes.post("/upload", isAuthenticated, cPublicaciones.create);
routes.get(
  "/getPublicacionesUser",
  isAuthenticated,
  cPublicaciones.getAllFromUser
);
routes.get("/getPublicacionesPublic", cPublicaciones.getAllPublic);

routes.delete("/deletePubli", isAuthenticated, cPublicaciones.delete);
routes.get("/download", isAuthenticated, cPublicaciones.download);

export default routes;
