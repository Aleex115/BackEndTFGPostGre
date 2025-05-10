import { Router } from "express";
import cPeticiones from "../controllers/cPeticiones.js";

let routes = Router();

routes.post("/petition", cPeticiones.create);
routes.delete("/petition", cPeticiones.delete);
routes.get("/getAllPetition", cPeticiones.getAllUser);
routes.post("/acceptPetition", cPeticiones.accept);

export default routes;
