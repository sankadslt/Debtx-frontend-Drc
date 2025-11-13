import axios from "axios";
import api from "../auth/axiosInstance";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/money`;


// Fetching payment cases by DRC or RO based on filters
export const previewPaymentCases = async (payload) => {
  try {
    const response = await api.post(
      `${URL}/payments/drc-or-ro`, 
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching payment cases:", 
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_task_for_Download_Payment_Case_List = async (createdBy, Phase, from_date, to_date, Case_ID, Account_Number) => {
  try {
    const response = await api.post(`${URL}/Create_task_for_Download_Payment_Case_List`, {
      Created_By: createdBy, 
      Phase: Phase,
      from_date: from_date, 
      to_date: to_date, 
      Case_ID: Case_ID, 
      Account_Number: Account_Number
    }
  );

    // return the response status
    return response.data.status;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Fetching case payment details by case_id and money_transaction_id
export const Case_Details_Payment_By_Case_ID = async (case_id, money_transaction_id) => {
  try {
    // get token from localStorage
    const response = await api.post(`${URL}/Case_Details_Payment_By_Case_ID`, {
      case_id: case_id,
      money_transaction_id: money_transaction_id,
    }
  );

    // return the response data if the status is success
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch case details");
    }

  } catch (error) {
    console.error("Error fetching case details:", error);
    throw error.response?.data?.message || "Failed to fetch case details";
  }
};