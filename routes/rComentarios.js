import { Router } from "express";
import cComentarios from "../controllers/cComentarios.js";
let routes = Router();

routes.post("/comment", cComentarios.create);
routes.delete("/deleteComment", cComentarios.delete);
routes.get("/getAllComment", cComentarios.getAllFromPubli);

export default routes;
