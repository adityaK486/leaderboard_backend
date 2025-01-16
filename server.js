import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT||5000;

const app = express();

app.use(cors({
    origin: 'https://grand-fox-402735.netlify.app', 
}));
app.use(express.json());

app.use('/api/users',userRoutes);

app.listen(PORT,()=>{
    connectMongoDB();
    console.log(`Server is running on ${PORT}`);
})
