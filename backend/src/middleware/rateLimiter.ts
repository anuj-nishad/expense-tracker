import ratelimit from "../config/upstash.js";
import {db} from "../lib/db.js";
import type {Request, Response, NextFunction} from "express";

const rateLimiter = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {

    const {success} = await ratelimit.limit(`my-rate-limit`);

    if(!success){
      res.status(429).json({message: "Too many requests, please try again later"});
      return;
    }

    next();
  } catch (error) {
    console.log("Rate limit error",error);
    next(error);
  }
}

export default rateLimiter;