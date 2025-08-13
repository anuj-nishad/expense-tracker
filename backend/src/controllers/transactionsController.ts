import type { Request,Response } from "express";
import {db} from "../lib/db.js"
import z from "zod";

const transactionsSchema = z.object({
  title: z.string(),
  amount: z.number(),
  category: z.string(),
  userId: z.string()
});

export async function getTransactionsByUserId(req: Request, res: Response){
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Invalid User Id" });
    }

    const transactions = await db.transactions.findMany({
      where: {
        userId,
      },
      orderBy: {
        created_at: "asc"
      }
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.log('Error getting Transactions',error);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export async function createTransaction(req: Request, res: Response){
  try {
    const result = transactionsSchema.safeParse(req.body);

     if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }

    const {title, amount, category, userId} = result.data;

    await db.transactions.create({
      data: {
        title,
        amount,
        category,
        userId
      }
    });

    res.status(201).json({message: "Transaction created Succesfully"});
  } catch (error) {
    console.log('Error Creating Transaction',error);
    res.status(500).json({ message: "Internal Server Error"});
  }
}

export async function deleteTransactionById(req:Request, res: Response){
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).json({message: "Invalid Transaction Id"});    
    }  

    const result = await db.transactions.delete({
      where:{
        id
      }
    });

    if(!result) return res.status(404).json({message: "Transaction Not Found"});
    res.status(200).json({message: "Transaction Deleted Succesfully"});
  } catch (error) {
    console.log('Error deleting transaction',error);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export async function getSummaryByUserId(req:Request,res:Response){
  try{
    const {userId} = req.params;
    if(!userId) return res.status(400).json({message:"Invalid UserId"});

    const balance = await db.transactions.aggregate({
      _sum: {
        amount: true
      },
      where:{
        userId
      }
    });

    const income = await db.transactions.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId,
        amount: {
          gt: 0,
        },
      },
    });

    const expenses = await db.transactions.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId,
        amount: {
          lt: 0,
        },
      },
    });
    res.status(200).json({
    balance: balance._sum.amount || 0,
    income: income._sum.amount || 0,
    expenses: expenses._sum.amount || 0,
    });
  }
  catch(error){
    console.log('Error getting Summary',error);
    res.status(500).json({message: "Internal Server Error"});
  }
}