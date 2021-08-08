
import express, { Request, Response, NextFunction} from "express";
import cors from "cors";
import {waitForMongoose} from "./utils/mongoose";

import { passportSession } from "./components/user/jwt/middleware";

import { createRouter as authRouter } from "./components/user/jwt/router";
import { createRouter as adminRouter } from "./components/admin";
import { createRouter as financeRouter } from "./components/finance";

import {
  PUBLIC_SERVER_URL
} from "./constants/public";

waitForMongoose().then(()=>{
  var app = express();
  app.use((req, res, next)=>{
    // console.log("originalUrl", req.originalUrl)
    next()
  })
  app.use(cors());
  app.get("/", (req, res)=>{
    res.status(200).json({
      message: "Hello World"
    })
  })
  app.use(passportSession());
  app.use("/admin", adminRouter());
  app.use("/auth", authRouter())
  app.use("/finance", financeRouter())

  app.get("/user", (req, res, next)=>{
    if(req.user) res.status(200).json(req.user)
    else next({ status: 403, message: "no user"})
  })

  app.use(function(req, res, next) {
    next({
      status: 404,
      message: "Unknown"
    });
  });

  app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    res.status(err.status || 500);
    res.json({
      error: true,
      message: err.message || err.toString()
    })
  });

  app.listen(8080, ()=>{
    console.log("Accessible from:", PUBLIC_SERVER_URL)
  });


}).catch((err)=>{
    console.error(err);
    process.exit();
})
