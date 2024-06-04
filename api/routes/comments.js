import express from 'express'


const  commentRouter = express.Router()

commentRouter.get("/test", getUser);
export default commentRouter