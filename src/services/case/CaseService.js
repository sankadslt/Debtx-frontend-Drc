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



// Get Case Details by Case ID
export const drcCaseDetails = async (caseId) => {
  try {
    // Check if caseId is missing
    if (!caseId) {
      throw new Error("Case ID is required.");
    }
    // Send a POST request to fetch case details
    const response = await axios.post(`${URL}/Case_Details_for_DRC`, {
       case_id: caseId
    });
    // Check if the response indicates an error
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    console.log(response.data)
    console.log('response.data.data', response.data.data)
    // Map the response data to a structured caseDetails object
    const caseDetails = {
      case_id: response.data.caseId,
      customer_ref: response.data.customerRef,
      account_no: response.data.accountNo,
      current_arrears_amount: response.data.arrearsAmount,
      last_payment_date: response.data.lastPaymentDate,
      contact_Details: response.data.contactDetails,
      full_Address: response.data.fullAddress,
      nic: response.data.nic,
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
    // Check if caseData or case_id is missing
    if (!caseData || !caseData.case_id) {
      throw new Error("Case ID and data are required.");
    }

    // Check if either contact or remark is provided
    if (!caseData.contact && !caseData.remark) {
      throw new Error("Either contact or remark is required.");
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




