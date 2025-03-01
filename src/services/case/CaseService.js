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
export const assignROToCase = async (payload) => {
  try {
    const response = await axios.patch(`${URL}/Assign_RO_To_Case`, {
      drc_id: payload.drcId,
      case_ids: payload.caseIds,
      ro_id: payload.roId,
      assigned_by: payload.assigned_by
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

export const ListALLMediationCasesownnedbyDRCRO = async (payload) => {
  try {
    if (!payload.drc_id && !payload.ro_id) {
      throw new Error("DRC ID or RO ID is required.");
    }

    const response = await axios.post(`${URL}/List_All_DRC_Mediation_Board_Cases`, payload);
    
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    // Format the response data including status
    const formattedCases = response.data.data.map((caseData) => {
      return {
        case_id: caseData.case_id,
        status: caseData.status, // Added status field
        created_dtm: caseData.created_dtm,
        area: caseData.area,
        ro_name: caseData.ro_name || null,
        mediation_board_count: caseData.mediation_board_count,
        next_calling_date: caseData.next_calling_date,
      };
    });

    return formattedCases;
  } catch (error) {
    console.error("Error retrieving handling cases by DRC:", error.response?.data || error.message);
    throw error;
  }
};

// export const ListALLMediationCasesownnedbyxDRCRO = async (payload) => {

//   try {
//     const { 
//       drc_id, 
//       rtom, 
//       ro_id, 
//       action_type, 
//       from_date, 
//       to_date, 
//       case_current_status 
//     } = payload;

//     if (!drc_id && !ro_id) {
//       throw new Error("DRC ID or RO ID is required.");
//     }

//     const response = await axios.post(`${URL}/List_All_DRC_Mediation_Board_Cases`, {
//       drc_id,
//       ro_id,
//       ...(rtom && { rtom }),
//       ...(action_type && { action_type }),
//       ...(from_date && { from_date }),
//       ...(to_date && { to_date }),
//       ...(case_current_status && { case_current_status }),
//     });

//     if (response.data.status === "error") {
//       throw new Error(response.data.message || "Failed to retrieve cases");
//     }
//     console.log("response.data.data",response.data.data[0].mediation_details.next_calling_date.split("T")[0]);
//     return response.data.data || [];
    
    
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || error.message;
//     console.error("Error retrieving DRC Mediation Board cases:", errorMessage);
//     throw new Error(errorMessage);
//   }
// };


// get CaseDetails for MediationBoard


export const getCaseDetailsbyMediationBoard = async (case_id, drc_id) => {
  try {
    if (!case_id || !drc_id) {
      throw new Error("Both Case ID and DRC ID are required.");
    }
    
    const response = await axios.post(`${URL}/Case_Details_for_DRC`, {
      case_id: case_id,
      drc_id: drc_id,
    });
    
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    
    // Format the response to include only required fields
    const caseDetails = {
      case_id: response.data.data.case_id,
      customer_ref: response.data.data.customer_ref,
      account_no: response.data.data.account_no,
      current_arrears_amount: response.data.data.current_arrears_amount,
      last_payment_date: response.data.data.last_payment_date,
      mediation_board: response.data.data.calling_round,
    };
    
    return caseDetails;
  } catch (error) {
    console.error("Error retrieving case details for mediation board:", 
      error.response?.data || error.message);
    throw error;
  }
};

export const ListActiveMediationResponse = async () => {
  try {    
    const response = await axios.get(`${URL}/List_Active_Mediation_Response`);
    
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    if(response.data.status === "success"){
      return response.data.data;
    }
  } catch (error) {
    console.error("Error retrieving case details for mediation board:", 
    error.response?.data || error.message);
    throw error;
  }
};


// List Active RO Requests Mediation
export const ListActiveRORequestsMediation = async () => {
  try {
    const response = await axios.post(`${URL}/List_Active_RO_Requests_Mediation`);
    
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error retrieving RO requests:", error.response?.data?.message || error.message);
    throw error;
  }
};
