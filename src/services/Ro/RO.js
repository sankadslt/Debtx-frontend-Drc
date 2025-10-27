import axios from "axios";
import api from "../../../../Debtx-frontend-DRC/src/services/auth/axiosInstance";
// import api from "../auth/axiosInstance";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/recovery_officer`;




export const SuspendRO = async (roId) => {
    try {
        const response = await axios.patch(`${URL}/Suspend_RO`, { ro_id: roId });

        if (response.data.status === 'success') {
            return response.data;
        } else {
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
        const response = await axios.post(`${URL}/RO_Details_By_ID`, { ro_id: roId });

        if (response.data.status === 'success') {
            return response.data;
        } else {
            console.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error Getting details of Ro:", error.message);
        throw error;
    }
};

export const fetchRODataByDRC = async (drc_id) => {
    try {
        const response = await axios.post(`${URL}/List_RO_Owned_By_DRC`, { drc_id });

        return response.data?.data || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching RO data');
    }
};

export const fetchRODetails = async () => {
    try {
        const response = await axios.get(`${URL}/RO_Details`);

        return response.data?.data || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching Recovery Officer details');
    }
};

export const fetchRODataByID = async (roId) => {
    const response = await fetch(`${URL}/RO_Details_By_ID`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ro_id: roId }),
    });
    return response.json();
};

export const editRecoveryOfficer = async (data) => {
    const response = await fetch(`${URL}/Change_RO_profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const ChangeRoStatus = async (rodetails) => {
    try {
        const response = await axios.patch(`${URL}/Change_RO_Status`, {
            ro_id: rodetails.roId,
            ro_status: rodetails.ro_status
        });

        if (response.data.status === 'success') {
            return response.data;
        } else {
            console.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error changing Ro status:", error.message);
        throw error;
    }
};

export const registerRecoveryOfficer = async (data) => {
    try {
        const response = await axios.post(`${URL}/Register_RO`, data);
        return response.data;
    } catch (error) {
        console.error("Error in RegisterRO:", error.response?.data || error.message);
        throw error.response?.data || new Error("An error occurred while registering the Recovery Officer.");
    }
};

export const fetchRODataByDRCWithQueryParams = async (drc_id) => {
    try {
        const response = await axios.post(`${URL}/List_RO_Owned_By_DRC`, null, { params: { drc_id } });

        return response.data?.data || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching RO data');
    }
};

export const getActiveRODetailsByDrcID = async (drc_id) => {
    try {
        // get token from localStorage
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(`${URL}/List_Active_RO_Owned_By_DRC`, { drc_id },
        {
        headers: {
          Authorization: `Bearer ${token}`, // attach JWT
          "Content-Type": "application/json",
        },
      }
        );

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

export const List_All_RO_and_DRCuser_Details_to_DRC = async (payload) => {
    try {
         const token = localStorage.getItem("accessToken"); 
         console.log("Access Token from localStorag list:", token || "No token found");

    const response = await api.post(
      `${URL}/List_All_RO_and_DRCuser_Details_to_DRC`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
          "Content-Type": "application/json",
        },
      }
    );

        if (response.data.status === "error") {
            throw new Error(response.data.message);
        }

        return response.data;
    } catch (error) {
        console.error("Error retrieving List_All_RO_and_DRCuser_Details_to_DRC:", error.response?.data || error.message);
        throw error;
    }
};

export const List_RO_Info_Own_By_RO_Id = async (payload) => {
    try {
         const token = localStorage.getItem("accessToken");
         console.log("Access Token from localStorage:", token || "No token found");

         const response = await api.post(
      `${URL}/List_RO_Info_Own_By_RO_Id`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
          "Content-Type": "application/json",
        },
      }
    );

        if (response.data.status === "error") {
            throw new Error(response.data.message);
        }

        return response.data;
    } catch (error) {
        console.error("Error retrieving List_RO_Info_Own_By_RO_Id:", error.response?.data || error.message);
        throw error;
    }
};


// Terminate Recovery Officer
export const terminateRO = async (terminationDetails) => {
    try {
         const token = localStorage.getItem("accessToken");
        console.log("Authorization header will be:", `Bearer ${token}`);
        
        const response = await api.patch(`${URL}/Terminate_RO`, terminationDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });


        if (response.data.status === 'success') {
            return response.data;
        } else {
            console.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error terminating RO:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error terminating Recovery Officer.');
    }
};

// Update RO or DRC user details
export const updateROorDRCUserDetails = async (data) => {
  try {
    const token = localStorage.getItem("accessToken");

    console.log("Authorization header will be:", `Bearer ${token}`);

    const response = await api.patch(`${URL}/Update_RO_or_DRCuser_Details`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // support both response formats: { status: "success" } or { success: true }
    if (response.data?.status === "success" || response.data?.success) {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Failed to update RO or DRC user details");
    }
  } catch (error) {
    console.error("Error updating RO or DRC user:", {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });

    throw error?.response?.data?.message || "An error occurred while updating RO or DRC user details";
  }
};


export const createNewDRCUserOrRO = async (data) => {
    try {
        const token = localStorage.getItem("accessToken");

        console.log("Authorization header will be:", `Bearer ${token}`);

        const response = await api.post(`${URL}/Create_New_DRCUser_or_RO`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.success) {
            return response.data;
        } else {
            console.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error creating DRC User or RO:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error creating DRC User or Recovery Officer.');
    }
};
