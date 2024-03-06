import express from 'express';
import mongoose from 'mongoose';
import userRouter from "./routes/User.route.js";
import authRouter from "./routes/Auth.route.js"
import dotenv from "dotenv"

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("DB is connected");
}).catch((err)=>{
    console.log(err);
})

const app = express();



app.listen(3000,()=>{
    console.log("listening on port 3000!!");
})

app.use(express.json());

app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);