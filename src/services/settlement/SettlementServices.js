import api from "../auth/axiosInstance";
import axios from "axios";
//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/settlement`;

export const listAllSettlementCasesForDRC = async (payload) => {
  try {
    // get token from localStorage
    const response = await api.post(
      `${URL}/List_All_Settlement_Cases_For_DRC`,
      payload
    );
    return response;
  } catch (error) {
    console.error(
      "Error withdrawing Settlement cases :",
      error.response?.data || error.message
    );
    throw error;
  }
};