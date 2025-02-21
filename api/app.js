import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js"
import authRoute from "./routes/auth.route.js"


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


app.listen(3000, () =>{
    console.log("Server is running on port 3000");
    
})
