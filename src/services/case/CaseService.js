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


// List All Active ROs By DRC and RTOM
export const listAllActiveRosByDRCID = async (drcId, rtomArea) => {
  try {
    if (!drcId || !rtomArea) {
      throw new Error("drcId and rtomArea are required parameters.");
    }

    console.log("Sending request with DRC ID:", drcId, "and RTOM Area:", rtomArea);

    const response = await axios.post(`${URL}/List_All_Active_ROs_By_DRC`, 
      {
        drc_id: drcId,
        rtom_area: rtomArea,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("API response:", response.data); // Log the response data
    return response.data;

  } catch (error) {
    console.error("Error fetching active Recovery Officers:", error.toJSON ? error.toJSON() : error);
    throw error;
  }
};


// Fetch all arrears bands
export const fetchAllArrearsBands = async () => {
  try {
    const response = await axios.get(`${URL}/getAllArrearsBands`);
    const data = response.data.data;
    
    // Exclude the _id key and return only arrears bands
    const arrearsBands = Object.entries(data)
      .filter(([key]) => key !== "_id") // Exclude _id
      .map(([, value]) => value); // Extract only the values

    return arrearsBands; // Return only the arrears bands
  } catch (error) {
    console.error("Error fetching arrears bands:", error.response?.data || error.message);
    throw error;
  }
};


