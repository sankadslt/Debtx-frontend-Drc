import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/recovery_officer`;
const DRC_URL = `${BASE_URL}/DRC`;

export const listROAllCases = async (status, page, drc_id) => {
  try {
    // Create the payload object
    const payload = {
      status: status || "", // Ensure empty string if status is null/undefined
      pages: page || 1,      // Default to page 1 if not provided
      drc_id: drc_id
    };
    
    console.log("Sending payload to API:", payload);
    
    // Set up axios config with proper headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false // Set to true if you need to send cookies
    };
    
    // Make the API call
    const response = await axios.post(
      `${URL}/List_All_RO_Cases`, 
      payload,
      config
    );
    
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    // Handle common errors and provide more helpful messages
    if (error.code === 'ERR_NETWORK') {
      console.error(
        "Network error: Please check if the backend server is running and CORS is properly configured.", 
        error.message
      );
    } else {
      console.error(
        "Error fetching recovery officers:", 
        error.response?.data || error.message
      );
    }
    
    // Return a structured error response instead of throwing
    return {
      success: false,
      message: "Failed to fetch data",
      error: error.message,
      data: []
    };
  }
};

// // Function to fetch recovery officer info by RO ID
// export const fetchROInfoByROId = async (ro_id) => {
//   try {
//     // Validate input
//     if (!ro_id) {
//       throw new Error("ro_id is required.");
//     }

//     // Log the payload for debugging
//     console.log("Sending payload to API:", { ro_id });

//     // Make POST request
//     const response = await axios.post(`${URL}/List_RO_Info_Own_By_RO_Id`, { ro_id });

//     // Log the API response for debugging
//     console.log("API response:", response.data);

//     // Handle successful response
//     return response.data;
//   } catch (error) {
//     // Handle errors
//     console.error(
//       "Error fetching recovery officer info:",
//       error.response?.data || error.message
//     );
//     throw error.response?.data || { message: error.message };
//   }
// };


export const fetchROInfoByROId = async (ro_id) => {
  try {
    if (!ro_id) {
      throw new Error("ro_id is required.");
    }
    
    console.log("Sending payload to API:", { ro_id });
    
    const response = await axios.post(`${URL}/List_RO_Info_Own_By_RO_Id`, { ro_id });
    
    console.log("API response:", response.data);
    
    const data = response.data;
    
    return {
      added_date: data.added_date || "",
      recovery_officer_name: data.recovery_officer_name || "",
      nic: data.nic || "",
      contact_no: data.contact_no || "",
      email: data.email || null,
      rtom_areas: data.rtom_areas || [],
      remark: data.log_history || []
    };
    
  } catch (error) {
    console.error("Error fetching recovery officer info:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};
// Service for creating a Recovery Officer
export const createRecoveryOfficer = async (recoveryOfficerData) => {
  
  try {
    // Make a POST request to the API
    const response = await axios.post(`${URL}/Create_RO`, recoveryOfficerData);

    // Return the API response data
    return response.data;
  } catch (error) {
    // Handle errors from the API call
    console.error("Error creating Recovery Officer:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


export const getDebtCompanyDetailsByDRCID = async (drc_id) => {
  try {
    // Validate input
    if (!drc_id) {
      throw new Error("DRC_ID is required.");
    }

    // Make a POST request to fetch Debt Company details
    const response = await axios.post(`${DRC_URL}/List_DRC_Details_By_DRC_ID`, drc_id);
    console.log("API response:", response.data);

    // Return the API response data
    return response.data;
  } catch (error) {
    // Handle errors from the API call
    console.error("Error fetching Debt Company details:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


