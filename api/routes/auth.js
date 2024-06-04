import express from 'express'
import { Login, logout, register } from '../controller/authController.js';


const  authRouter = express.Router()

authRouter.post("/login", Login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);
export default authRouter