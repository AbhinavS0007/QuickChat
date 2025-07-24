import express from 'express';
import dotenv from 'dotenv'
import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser'
import cors from "cors"

const app = express();
dotenv.config();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // ✅ must match exactly, no slash
  credentials: true                // ✅ allow cookies and auth headers
}));



app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)



connectDB();



const PORT = process.env.PORT || 5002
app.listen(PORT, () => {
  console.log('Server is running on port : ' + PORT);
  
});