import { Router } from "express";
import cUsuario from "../controllers/cUsuario.js";
import { isAuthenticated } from "../middlewares/auth.js";
import multer from "multer";

let routes = Router();
let upload = multer(); // Nuevo middleware para procesar form-data

routes.post("/login", upload.none(), cUsuario.login);
routes.post("/signin", upload.none(), cUsuario.signin);

routes.put("/profile", isAuthenticated, cUsuario.updateProfile);
routes.put("/pwd", isAuthenticated, cUsuario.updatePwd);

routes.get("/user", isAuthenticated, cUsuario.getOne);
routes.get("/session", isAuthenticated, cUsuario.session);
routes.get("/logout", isAuthenticated, cUsuario.logout);
routes.get("/getAllUsers", isAuthenticated, cUsuario.getAll);

routes.delete("/deleteUser", isAuthenticated, cUsuario.delete);

export default routes;
