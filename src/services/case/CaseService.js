import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/case`;

// listHandlingCasesByDRC by drc_id 
export const listHandlingCasesByDRC = async (drcId) => {
  try {
    const response = await axios.post(`${URL}/List_Handling_Cases_By_DRC`, {
      drc_id: drcId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching handling cases by DRC:", error.response?.data || error.message);
    throw error;
  }
};

