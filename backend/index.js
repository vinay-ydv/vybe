import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import connectionRouter from "./routes/connection.routes.js"
import http from "http"
import { Server } from "socket.io"
import notificationRouter from "./routes/notification.routes.js"
dotenv.config()
let app=express()
let server=http.createServer(app)
export const io=new Server(server,{
    cors:({
        origin:[
      "http://localhost:5173",
      "https://vybe-frontend-2yjc.onrender.com"
    ],
        credentials:true
    })
})
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:[
    "http://localhost:5173",
    "https://vybe-frontend-2yjc.onrender.com"
  ],
    credentials:true
}))
let port=process.env.PORT || 5000
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/connection",connectionRouter)
app.use("/api/notification",notificationRouter)

// 404 (optional)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// GLOBAL ERROR HANDLER (must be last middleware)
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);   // full error + stack in Render logs
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

export const userSocketMap=new Map()
io.on("connection",(socket)=>{

   socket.on("register",(userId)=>{
    userSocketMap.set(userId,socket.id)
 console.log(userSocketMap)
   })
   socket.on("disconnect",(socket)=>{
    for (let [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
            userSocketMap.delete(key);
        }
    }
    console.log("User disconnected:", socket.id);
});
   }) 


server.listen(port,()=>{
    connectDb()
    console.log("server started");
})


