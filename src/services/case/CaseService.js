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

export const listDRCAllCases = async ({ drc_id, ro_id, From_DAT, TO_DAT, case_current_status }) => {
  try {
    const response = await axios.post(`${URL}/List_All_DRC_Negotiation_Cases`, {
      drc_id,
      ro_id,
      From_DAT,
      TO_DAT,
      case_current_status: case_current_status || null, // Ensure it's not undefined
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching DRC all cases:", error.response?.data || error.message);
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

