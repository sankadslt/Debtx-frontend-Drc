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

    const result = await axios.post(`${URL}/List_All_DRC_Mediation_Board_Cases`, payload);
    
    if (result.data.status === "error") {
      throw new Error(result.data.message);
    }

    // Format the response data including status
    const formattedCases = result.data.data.map((caseData) => {
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
    console.error("Error retrieving handling cases by DRC:", error.result?.data || error.message);
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
    
    const data = response.data.data;
    
    // Process arrays to remove entries with empty or dash values
    if (data.mediation_board && Array.isArray(data.mediation_board)) {
      data.mediation_board = data.mediation_board.filter(item => {
        // Check if any property has a meaningful value (not empty, not dash)
        return Object.values(item).some(val => 
          val !== "" && val !== "-" && val !== null && val !== undefined
        );
      });
      
      // Remove empty array
      if (data.mediation_board.length === 0) {
        delete data.mediation_board;
      }
    }
    
    if (data.settlement && Array.isArray(data.settlement)) {
      data.settlement = data.settlement.filter(item => {
        return Object.values(item).some(val => 
          val !== "" && val !== "-" && val !== null && val !== undefined
        );
      });
      
      if (data.settlement.length === 0) {
        delete data.settlement;
      }
    }
    
    if (data.ro_requests && Array.isArray(data.ro_requests)) {
      data.ro_requests = data.ro_requests.filter(item => {
        return Object.values(item).some(val => 
          val !== "" && val !== "-" && val !== null && val !== undefined
        );
      });
      
      if (data.ro_requests.length === 0) {
        delete data.ro_requests;
      }
    }
    
    return data;
    
  } catch (error) {
    console.error(
      "Error retrieving case details for mediation board:", 
      error.response?.data || error.message
    );
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

export const fetchBehaviorsOfCaseDuringDRC = async (payload) => {
  try {
    if (!payload.drc_id || !payload.case_id) {
      throw new Error("DRC ID and Case ID are required.");
    }

    const response = await axios.post(`${URL}/List_Behaviors_Of_Case_During_DRC`, payload);
    console.log("Response from handler: ", response.data);

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    
    // Return the successful response
    return response.data;
    
  } catch (error) {
    console.error("Error retrieving case details for mediation board:", 
      error.response?.data || error.message);
    // Rethrow the error to be handled by the component
    throw error;
  }
};


export const updateLastRoDetails =async(case_id, drc_id, remark) => {
  try {
    // if (!case_id || !drc_id || !remark) {
    //   throw new Error("All Fields are required.")
    // }

    //Convert caseID and drcId to integers
    const case_id_int =parseInt(case_id, 10);
    const drc_id_int =parseInt(drc_id, 10);

    console.log("Sending to backend:", { case_id_int, drc_id_int, remark }); 

    const response =await axios.patch(`${URL}/Update_case_last_Ro_Details`, {
      case_id: case_id_int,
      drc_id: drc_id_int,
      remark: remark
    });

    console.log("Response from handler: ", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error updating recovery officer details:", error.response?.data || error.message);
    throw error;
  }
}

export const listDRCAllCases = async (payload) => {
  try {
    if (!payload.drc_id && !payload.ro_id) {
      throw new Error("DRC ID or RO ID is required.");
    }

    const response = await axios.post(`${URL}/List_All_DRC_Negotiation_Cases`, payload);

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    // Format the response data including status
    const formattedCases = response.data.data.map((caseData) => {
      return {
        case_id: caseData.case_id,
        status: caseData.status, // Added status field
        created_dtm: caseData.created_dtm,
        ro_name: caseData.ro_name || null,
        contact_no: caseData.contact_no || null,
        area: caseData.area,
        action_type: caseData.action_type,
      };
    });

    return formattedCases;
  } catch (error) {
    console.error("Error retrieving cases by DRC:", error.response?.data || error.message);
    throw error;
  }
};


// Get Case Details by Case ID
export const drcCaseDetails = async (caseId) => {
  try {
    if (!caseId) {
      throw new Error("Case ID is required.");
    }

    const response = await axios.post(`${URL}/Case_Details_for_DRC`, {
       case_id: caseId
    });

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }


    // Extract ro_negotiation details safely
    const roNegotiationDetails = response.data.data.ro_negotiation 
      ? response.data.data.ro_negotiation.map((negotiation) => ({
          drc_id: negotiation.drc_id,
          ro_id: negotiation.ro_id,
          created_dtm: negotiation.created_dtm,
          field_reason_id: negotiation.field_reason_id,
          field_reason: negotiation.field_reason,
          remark: negotiation.remark,
        }))
      : [];


      const caseDetails = {
        case_id: response.data.data.case_id,
        customer_ref: response.data.data.customer_ref,
        account_no: response.data.data.account_no,
        current_arrears_amount: response.data.data.current_arrears_amount,
        last_payment_date: response.data.data.last_payment_date,
        ro_negotiation_details: roNegotiationDetails,
      };


    return caseDetails;
  } catch (error) {
    console.error("Error retrieving case details by ID:", error.response?.data || error.message);
    throw error;
  }
};


// Add Negotiation Case
export const addNegotiationCase = async (caseId,settleId,ini_amount, month, from,to,settle_remark,drcId,roId,requestId,request,intractionId,todo,completed,reasonId,reason,nego_remark ) => {
  try {
    if (!caseId || !reason || !request) {
      throw new Error("Case ID, reason, and request are required.");
    }

    const response = await axios.post(`${URL}/Customer_Negotiations`, {
      case_id: caseId,
      settlement_id: settleId || null,
      initial_amount: ini_amount || null,
      calender_month: month || null,
      duration_from: from || null,
      duration_to: to || null,
      settlement_remark:settle_remark || null,
      drc_id: drcId || null ,
      ro_id: roId || null,
      ro_request: request || null,
      ro_request_id: requestId || null,
      intraction_id: intractionId || null,
      todo_on: todo || null,
      completed_on: completed || null,
      field_reason: reason,
      field_reason_id: reasonId || null,
      remark: nego_remark || null
    });

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("Error adding negotiation case:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch active negotiations
export const fetchActiveNegotiations = async () => {
  try {
    const response = await axios.post(`${URL}/list_Active_Customer_Negotiations`);
    const data = response.data.data;

    // Format the response data
    const activeNegotiations = data.map((negotiation) => ({
      negotiation_id: negotiation.negotiation_id,
      negotiation_description: negotiation.negotiation_description,
      end_dtm: negotiation.end_dtm,
    }));

    return activeNegotiations;
  } catch (error) {
    console.error("Error fetching active negotiations:", error.response?.data || error.message);
    throw error;
  }
};


// Fetch active requests
export const getActiveRORequests = async () => {
  try {
    const response = await axios.post(`${URL}/List_Active_RO_Requests`);
    const data = response.data.data;

    // Format the response data
    const activeRORequests = data.map((requests) => ({
      ro_request_id: requests.ro_request_id,
      request_description: requests.request_description,
      intraction_id: requests.intraction_id,
    }));

    return activeRORequests;
  } catch (error) {
    console.error("Error fetching active requests:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch active requests
export const getActiveRORequestsforNegotiationandMediation = async (request_mode) => {
  try {
    const response = await axios.post(`${URL}/List_Active_RO_Requests`,{request_mode});
    const data = response.data.data;

    // Format the response data
    const activeRORequests = data.map((requests) => ({
      ro_request_id: requests.ro_request_id,
      request_description: requests.request_description,
      intraction_id: requests.intraction_id,
    }));

    return activeRORequests;
  } catch (error) {
    console.error("Error fetching active requests:", error.response?.data || error.message);
    throw error;
  }
};

// Get Case Details by Case ID
export const caseDetailsforDRC = async (caseId, drcId) => {
  try {
    // Validate inputs
    if (!caseId || !drcId) {
      throw new Error("Both Case ID and DRC ID are required.");
    }
    
    // Send a POST request to fetch case details
    const response = await axios.post(`${URL}/Case_Details_for_DRC`, {
       case_id: caseId,
       drc_id: drcId
    });
    
    // Check if the response indicates an error
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    console.log(response.data);
    console.log('response.data.data', response.data.data);
    
    // Map the response data to a structured caseDetails object
    const caseDetails = {
      case_id: response.data.data.case_id,
      customer_ref: response.data.data.customer_ref,
      account_no: response.data.data.account_no,
      current_arrears_amount: response.data.data.current_arrears_amount,
      last_payment_date: response.data.data.last_payment_date,
      contactDetails: response.data.data.current_contact || [],
      full_Address: response.data.data.full_Address,
      nic: response.data.data.nic,
    };
    
    return caseDetails;
  } catch (error) {
    console.error("Error retrieving case details by ID:", error.response?.data || error.message);
    throw error;
  }
};


// Update Customer Profile
export const updateCustomerContacts = async (caseData) => {
  try {
    // Validate required fields
    if (!caseData.case_id) {
      throw new Error("Case ID is required");
    }
    
    // Check if the response indicates an error
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    
    console.log('caseData', caseData)
    // Send a POST request to update customer contacts
    const response = await axios.post(`${URL}/Update_Customer_Contacts`, caseData);
    console.log("Update Response:", response);
    return response;
  } catch (error) {
    console.error("Error updating customer contacts:", error.response?.data || error.message);
    throw error;
  }
};

// List Active RO Requests Mediation Board
export const ListActiveRORequestsMediation = async () => {
  try {
    // Specify that we only want requests with request_mode = "Mediation Board"
    const response = await axios.post(`${URL}/List_Active_RO_Requests_Mediation`, {
      request_mode: "Mediation Board"
    });
    
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error retrieving RO requests:", error.response?.data?.message || error.message);
    throw error;
  }
};
