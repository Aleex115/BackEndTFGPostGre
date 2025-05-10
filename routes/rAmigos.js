import { Router } from "express";
import cAmigos from "../controllers/cAmigos.js";

let routes = Router();

routes.post("/follow", cAmigos.create);
routes.delete("/unfollow", cAmigos.delete);
routes.get("/allFriends", cAmigos.getAll);

export default routes;
