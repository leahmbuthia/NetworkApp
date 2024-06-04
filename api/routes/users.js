import express from 'express'
import { getUser } from '../controller/userController.js'

const  userRouter = express.Router()

userRouter.get("/test", getUser);

export default userRouter