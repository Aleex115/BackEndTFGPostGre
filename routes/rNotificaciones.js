import { Router } from "express";
let routes = Router();
import cNotificaciones from "../controllers/cNotificaciones.js";

routes.put("/setRead", cNotificaciones.marcarLeida);
routes.get("/getAllNotifications", cNotificaciones.getAll);

export default routes;
