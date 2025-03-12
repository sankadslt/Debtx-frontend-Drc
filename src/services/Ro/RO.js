import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/recovery_officer`;

export const SuspendRO = async (roId) => {
    try {
        const response = await axios.patch(`${URL}/Suspend_RO`,{
            ro_id:roId
        });

        if (response.data.status === 'success') {
            return response.data;
        }
        else{
            console.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error suspending Ro:", error.message);
        throw error;
    }
};

export const GetRODetailsByID = async (roId) => {
    try {
        const response = await axios.post(`${URL}/RO_Details_By_ID`,{
            ro_id:roId
        });

        if (response.data.status === 'success') {
            return response.data;
        }
        else{
            console.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error Geting details of Ro:", error.message);
        throw error;
    }
};


export const fetchRODataByDRC = async (drc_id) => {
    try {
        const response = await axios.post('http://localhost:5000/api/recovery_officer/List_RO_Owned_By_DRC', {
            drc_id,
        });

        // Ensure the data aligns with the updated backend response structure
        return response.data?.data || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching RO data');
    }
};


export const fetchRODetails = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/recovery_officer/RO_Details');

        // Ensure the data aligns with the updated backend response structure
        return response.data?.data || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching Recovery Officer details');
    }
};


export const fetchRODataByID = async (roId) => {
    const response = await fetch("http://localhost:5000/recovery_officer/RO_Details_By_ID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ro_id: roId }),
    });
    return response.json();
  };
  
  
  export const editRecoveryOfficer = async (data) => {
    const response = await fetch("http://localhost:5000/api/recovery_officer/Change_RO_profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  
  export const ChangeRoStatus = async (rodetails) => {
    try {
        const response = await axios.patch(`${URL}/Change_RO_Status`,{
            ro_id:rodetails.roId,
            ro_status:rodetails.ro_status
        });

        if (response.data.status === 'success') {
            return response.data;
        }
        else{
            console.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error suspending Ro:", error.message);
        throw error;
    }
};

// Register Recovery Officer
export const registerRecoveryOfficer = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/recovery_officer/Register_RO",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error in RegisterRO:", error.response?.data || error.message);
      throw error.response?.data || new Error("An error occurred while registering the Recovery Officer.");
    }
  };

  export const fetchRODataByDRCWithQueryParams = async (drc_id) => {
    try {
        const response = await axios.post(
            'http://localhost:5000/recovery_officer/List_RO_Owned_By_DRC', 
            null, // No request body, just the query parameter
            {
                params: {
                    drc_id, // Send drc_id as a query parameter
                },
            }
        );

        // Ensure the data aligns with the updated backend response structure
        return response.data?.data || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching RO data');
    }
};

//List_Active_RO_Owned_By_DRC by drc_id
// export const roassignedbydrc = async (drc_id) => {
//     try {
//       const response = await axios.post(`${URL}/List_Active_RO_Owned_By_DRC`, {
//         drc_id,
//       });
//         // Ensure the data aligns with the updated backend response structure
//         return response.data?.data || [];
//     } catch (error) {
//         throw new Error(error.response?.data?.message || 'Error fetching RO data');
//     }
// };


/**
 * Retrieve active Recovery Officers by DRC ID
 * @param {number} drcId - The ID of the Debt Recovery Company.
 * @returns {Promise<object>} - The API response containing the list of active recovery officers.
 * @throws {Error} - Throws an error if the request fails.
 */
export const getActiveRODetailsByDrcID = async (drc_id) => {
  try {
    const response = await axios.post(`${URL}/List_Active_RO_Owned_By_DRC`, {
      drc_id,
    });

    if (response.data.status === "success") {
      return response.data?.data || [];
    } else {
      console.error(response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error retrieving active recovery officers:", error.message);
    throw error;
  }
};  
