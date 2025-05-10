import { Router } from "express";
import cLike from "../controllers/cLike.js";
let routes = Router();

routes.post("/giveLike", cLike.create);
routes.delete("/deleteLike", cLike.delete);
routes.get("/getAllFromPubli", cLike.getAllFromPubli);

export default routes;
