import express from "express";
import dotenv from "dotenv";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json())

app.get('/api/health',(req,res)=>{
  res.status(200).json({status: "OK"})
})

app.use("/api/transactions", transactionsRoutes);
app.use("/api/user",userRoutes)

app.listen(PORT, ()=>{
  console.log(`Server is  running on ${PORT}`)
})