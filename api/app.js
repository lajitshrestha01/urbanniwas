import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js"
import propertyRoutes from './routes/property.routes.js';
import userRoutes from './routes/agentProfile.js'
import agentRoutes from './routes/user.route.js'


const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


app.use("/api/auth", authRoute);
app.use('/api/properties',propertyRoutes);
app.use("/api/user",userRoutes);
app.use('/api/agent',agentRoutes);


app.listen(3000, () =>{
    console.log("Server is running on port 3000");
    
})
