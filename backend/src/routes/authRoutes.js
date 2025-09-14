import { Router } from "express";
import {registerUser} from "../controllers/authController.js"
const authRouter=new Router();

authRouter.route('/register').post(registerUser);

export default authRouter;