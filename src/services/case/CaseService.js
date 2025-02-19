import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/case`;

// List Handling Cases By DRC
export const listHandlingCasesByDRC = async (payload) => {
  try {
    if (!payload.drc_id) {
      throw new Error("DRC ID is required.");
    }

    const response = await axios.post(`${URL}/List_Handling_Cases_By_DRC`, payload);
    
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    // Format the response data including status
    const formattedCases = response.data.data.map((caseData) => {
      return {
        case_id: caseData.case_id,
        status: caseData.status, // Added status field
        created_dtm: caseData.created_dtm,
        current_arrears_amount: caseData.current_arreas_amount, 
        area: caseData.area,
        remark: caseData.remark || null,
        expire_dtm: caseData.expire_dtm,
        ro_name: caseData.ro_name || null,
      };
    });

    return formattedCases;
  } catch (error) {
    console.error("Error retrieving handling cases by DRC:", error.response?.data || error.message);
    throw error;
  }
};


// Assign Recovery Officer to Case
export const assignROToCase = async (caseIds, roId, drcId, assignedBy) => {
  try {
    const response = await axios.patch(`${URL}/Assign_RO_To_Case`, {
      case_ids: caseIds,
      ro_id: roId,
      drc_id: drcId,
      assigned_by: assignedBy
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

    // Exclude the _id key and return both the key-value pairs
    const arrearsBands = Object.entries(data)
      .filter(([key]) => key !== "_id") // Exclude _id
      .map(([key, value]) => ({ key, value })); // Return both the key and the value as an object

    return arrearsBands; // Return an array of objects with key-value pairs
  } catch (error) {
    console.error("Error fetching arrears bands:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch assigned RO case logs with the filter payload using axios
export const fetchAssignedRoCaseLogs = async (payload) => {
  console.log('Filter payload:', payload); // Log the filter payload
  try {
    // Send the filter data to the backend via POST request using axios
    const response = await axios.post(`${URL}/List_Handling_Cases_By_DRC`, payload);

    if (response.data) {
      console.log('Filtered data:', response.data);
      return response.data; // Return the filtered data
    } else {
      console.error('Failed to fetch data');
      return []; // Return an empty array if the request fails
    }
  } catch (error) {
    console.error('Error during filtering:', error);
    return []; // Return an empty array in case of error
  }
};

export const fetchBehaviorsOfCaseDuringDRC = async (payload) => {
  try {
    if (!payload.drc_id || !payload.case_id) {
      throw new Error("DRC ID and Case ID are required.");
    }

    const response = await axios.post(`${URL}/List_Behaviors_Of_Case_During_DRC`, payload);

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    const formattedData = {
      caseDetails: {
        case_id: response.data.data.formattedCaseDetails.case_id,
        customer_ref: response.data.data.formattedCaseDetails.customer_ref,
        account_no: response.data.data.formattedCaseDetails.account_no,
        current_arrears_amount: response.data.data.formattedCaseDetails.current_arrears_amount,
        last_payment_date: response.data.data.formattedCaseDetails.last_payment_date,
        ref_products: response.data.data.formattedCaseDetails.ref_products || [],
      },
      settlementData: response.data.data.settlementData,
      paymentData: response.data.data.paymentData,
      additionalData: {
        ro_negotiation: response.data.data.formattedCaseDetails.ro_negotiation,
        ro_requests: response.data.data.formattedCaseDetails.ro_requests,
      }
    };

    return formattedData;
  } catch (error) {
    console.error("Error retrieving behaviors of case during DRC:", error.response?.data || error.message);
    throw error;
  }
};


 


/* export const List_Behaviors_Of_Case_During_DRC = async (drcId, caseId) => {
  try {
    if (!drcId || !caseId) {
      return { status: "error", message: "drcId and caseId are required parameters." };
    }

    console.log("Fetching case details for DRC ID:", drcId, "and Case ID:", caseId);

    const response = await axios.post(
      `${URL}/List_Behaviors_Of_Case_During_DRC`,
      { drc_id: drcId, case_id: caseId },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching case details:", error);

    if (error.response) {
      // The request was made, but the server responded with an error status
      return {
        status: "error",
        message: error.response.data.message || "An error occurred on the server.",
        errors: error.response.data.errors || {},
        statusCode: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return { status: "error", message: "No response from server. Please try again later." };
    } else {
      // Something happened in setting up the request
      return { status: "error", message: error.message || "An unexpected error occurred." };
    }
  }
};
 */

// List Behaviors Of Case During DRC
export const List_Behaviors_Of_Case_During_DRC = async (drcId, caseId) => {
  try {
    if (!drcId || !caseId) {
      throw new Error("DRC ID and Case ID are required.");
    }

    const response = await axios.post(
      `${URL}/List_Behaviors_Of_Case_During_DRC`,
      { drc_id: drcId, case_id: caseId }
    );
    console.log("API Response:", response.data);

   
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

   
    return response.data;

  } catch (error) {
    console.error("Error retrieving behaviors of case during DRC:", error.response?.data || error.message);
    
    // Return an error response if something goes wrong
    return {
      status: "error",
      message: error.response?.data.message || error.message || "An unexpected error occurred.",
      errors: error.response?.data.errors || {},
    };
  }
};