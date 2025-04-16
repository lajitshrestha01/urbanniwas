import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js"
import propertyRoutes from './routes/property.routes.js';
import userRoutes from './routes/agentProfile.js';
import agentRoutes from './routes/user.route.js';
import cityRoutes from './routes/city.routes.js';
import favoriteRoutes from './routes/favorites.routes.js';
import filterRoutes from './routes/filterPropery.routes.js'


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
app.use('/api/filter', filterRoutes);
app.use("/api/user",userRoutes);
app.use('/api/agent',agentRoutes);
app.use('/api/properties/city', cityRoutes);
app.use('/api/favorites', favoriteRoutes);


app.listen(3000, () =>{
    console.log("Server is running on port 3000");
    
})
