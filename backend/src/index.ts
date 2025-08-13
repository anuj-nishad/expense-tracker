import express from "express";
import dotenv from "dotenv";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";
import job from "./config/cron.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

if(process.env.NODE_ENV === "production") job.start();
app.use(rateLimiter);
app.use(express.json())

app.get('/api/health',(req,res)=>{
  res.status(200).json({status: "OK"})
});

app.use("/api/transactions", transactionsRoutes);

app.listen(PORT, ()=>{
  console.log(`Server is  running on ${PORT}`)
})