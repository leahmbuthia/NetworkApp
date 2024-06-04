import express from 'express'
import userRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import dotenv from 'dotenv';
import logger from './utils/logger.js';

dotenv.config();
const app = express();

 // Middleware to parse JSON bodies
app.use(express.json());
const port = process.env.PORT || 3000;

app.use('/api', userRouter);
app.use('/api', authRouter);


app.listen(port, () => {
    logger.info(`server running on port http://localhost:${port}`);
});