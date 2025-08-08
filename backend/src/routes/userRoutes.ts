import z from "zod";
import express from "express";
import type { Request, Response } from "express";
import { db } from "../lib/db.js";

const router = express.Router();

const userSchema = z.object({
  name: z.string(),
  email: z.string().min(1),
});

router.get('/', async(req:Request, res:Response) => {
  try {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }
    const { email } = result.data;

    const user = await db.user.findUnique({
      where: {
        email
      }
    });

    if(!user) return res.status(404).json({message: "User Not Found"});

    res.status(200).json(user);

  } catch (error) {
    console.log('Error getting user');
    res.status(500).json({message: "Internal Server Error"});
  }
});

router.post('/', async(req:Request, res:Response) => {
  try {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }
    const { name, email } = result.data;

    const isUser = await db.user.findUnique({
      where:{
        email
      }
    });

    if(isUser) return res.status(409).json({message: "User already exists"})

    const user = await db.user.create({
      data: {
        name,
        email
      }
    });
    res.status(201).json({message: "User created Succesfully",user})

  } catch (error) {
    console.log('Error creating user',error);
    res.status(500).json({message: "Internal Server Error"});
  }
});

export default router;