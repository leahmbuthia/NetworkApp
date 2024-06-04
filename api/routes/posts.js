import express from 'express'


const  postRouter = express.Router()

postRouter.get("/test", getUser);
export default postRouter