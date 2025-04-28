import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import  cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js";
import path from "path"


dotenv.config();
const __dirname = path.resolve()
const PORT = process.env.PORT

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }
  

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser())
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cors(
   { origin: "http://localhost:5173",
    credentials: true,
   }

))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(PORT, () =>{
    console.log("server is runnin in port PORT:" + PORT);
    connectDB();
});
