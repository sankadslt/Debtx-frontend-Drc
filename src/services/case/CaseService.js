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

// Assign Recovery Officer to Case
export const assignROToCase = async (caseIds, roId) => {
  try {
    const response = await axios.patch(`${URL}/Assign_RO_To_Case`, {
      case_ids: caseIds,
      ro_id: roId,
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning Recovery Officer to cases:", error.response?.data || error.message);
    throw error;
  }
};