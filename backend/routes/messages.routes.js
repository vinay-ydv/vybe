import express from "express";
import isAuth from "../middlewares/isAuth.js";

let messageRouter = express.Router();

messageRouter.get("/messages", isAuth, (req, res) => {
  res.send("Hello, this is a simple message!");
});

export default messageRouter;
