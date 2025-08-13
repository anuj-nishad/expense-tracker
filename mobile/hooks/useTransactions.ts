import { useCallback, useState } from "react"
import axios from "axios";
import { Alert } from "react-native";
import { API_URL } from "@/constants/api";

export const useTransactions = ( userId: string )=>{

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async()=>{
    try {
      const response = await axios.get(`${API_URL}/${userId}`);   
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions: ",error);
    }
  },[userId]);

  
  const fetchSummary = useCallback(async()=>{
    try {
      const response = await axios.get(`${API_URL}/summary/${userId}`);
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary: ",error);
    }
  },[userId]);

  const loadData = useCallback(async()=>{
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data: ",error);
    }finally{
      setIsLoading(false);
    }
  },[fetchTransactions, fetchSummary, userId]);

  
  const deleteTransaction = async(id:string)=>{
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if(!response) throw new Error("Failed to delete transaction");

      loadData();
      Alert.alert("Success", "Transaction deleted successfully")
    } catch (error) {
      console.error("Error deleting transaction: ", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Error", errorMessage);
    }
  };

  return {transactions, summary, isLoading, loadData, deleteTransaction};


} 