import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js"
import authRoute from "./routes/auth.route.js"
import propertyRoutes from './routes/property.routes.js';


const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use('/api/properties',propertyRoutes);


app.listen(3000, () =>{
    console.log("Server is running on port 3000");
    
})
