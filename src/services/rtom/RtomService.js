/* 
    Purpose: This template is used for the DRC Routes.
    Created Date: 2024-12-26
    Created By: Sasindu Srinayaka (sasindusrinayaka@gmail.com)
    Last Modified Date: 2024-12-30
    Modified By: Sasindu Srinayaka (sasindusrinayaka@gmail.com)
    Version: Node.js v20.11.1
    Dependencies: express
    Related Files: RTOM_controller.js, Rtom.js
    Notes:  
*/

import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/RTOM`;

export const registerRTOM = async (rtomData) => {
  try {
    const response = await axios.post(`${URL}/Register_RTOM`, rtomData);
    return response.data; // Return the entire response data
  } catch (error) {
    console.error("Error Registering RTOM:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export const getRTOMDetails = async () => {
    try {
        const response = await axios.get(`${URL}/RTOM_Details`);
        return response.data;
    } catch (error) {
        console.error("Error fetching RTOM Details:", error);
        throw error;
    }
};

export const getRTOMDetailsById = async (rtom_id) => {
    try {
      console.log(rtom_id);
      const response = await axios.post(`${URL}/RTOM_Details_By_ID`, {
        rtom_id: rtom_id,
      });
      if (response.data.status === "success") {
        console.log(response.data.data);
        return response.data.data; 
      } else {
        console.error(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching RTOM details:", error.message);
      throw error;
    }
};

export const updateRTOMStatus = async (rtom_id, rtom_status, updated_by, reason ) => {
    try {
      const response = await axios.post(`${URL}/Change_RTOM_Status`, {
        rtom_id: rtom_id,
        rtom_status: rtom_status,
        updated_by: updated_by,
        reason: reason,
      });
      return response.data;
    } catch (error) { 
      console.error("Error changing RTOM status:", error);
      throw error;
    }
};

export const updateRTOMDetails = async (rtom_id, rtom_status, rtom_contact_number, rtom_fax_number, reason) => {
    try {
      const response = await axios.patch(`${URL}/Change_RTOM_Details`, {
        rtom_id: rtom_id,
        rtom_status: rtom_status,
        rtom_contact_number: rtom_contact_number,
        rtom_fax_number: rtom_fax_number,
        reason: reason,
      });
      if (response.data.status === "success") {
        return response.data;
      };
      return response.data;
    } catch (error) {
      console.error("Error updating RTOM details:", error);
      throw error;
    } 
};

export const suspendRTOM = async (rtom_id, rtom_end_date, reason) => {
    try {
      const response = await axios.patch(`${URL}/Suspend_RTOM`, {
        data: {
          rtom_id: rtom_id,
          rtom_end_date: rtom_end_date,
          reason: reason,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error Suspending RTOM:", error);
      throw error;
    }
};
/*
// Fetch RTOMs based on DRC ID
export const getRTOMsByDRCID = async (drc_id) => {
  try {
      const response = await axios.post(`${URL}/List_All_RTOM_Ownned_By_DRC`, {
          drc_id: drc_id
      });

      if (response.data.status === "success") {
          console.log('RTOMs:', response.data.data); // Log RTOM data
          return response.data.data; // Return RTOM data
      } else {
          console.error(response.data.message);
          throw new Error(response.data.message);
      }
  } catch (error) {
      console.error("Error fetching RTOMs for DRC:", error.message);
      throw error;
  }
};
*/


export const getRTOMsByDRCID = async (drc_id) => {
    try {
        const response = await axios.post(`${URL}/List_All_RTOM_Ownned_By_DRC`, {
            drc_id: drc_id
        });

        if (response.data?.status === "success" && response.data?.data) {
            console.log("RTOMs:", response.data.data); // Log RTOM data
            return response.data.data; // Return RTOM data
        } else {
            console.error("API Error:", response.data?.message || "Unexpected response structure");
            return []; // Return an empty array instead of throwing an error
        }
    } catch (error) {
        console.error("Error fetching RTOMs for DRC:", error.response?.data || error.message);
        return []; // Return an empty array in case of error to prevent breaking UI
    }
};


// RtomService.js
export const getActiveRTOMsByDRCID = async (drc_id) => {
  try {
    const response = await axios.post(`${URL}/List_ALL_Active_RTOM_Ownned_By_DRC`, {
      drc_id: drc_id
    });

    if (response.data?.status === "success" && response.data?.data) {
      // Transform the response to match the area field from the model
      const transformedRTOMs = response.data.data.map(rtom => ({
        rtom_id: rtom.rtom_id,
        area_name: rtom.area_name, // This matches with the 'area' field in the case model
        rtom: rtom.area_name // Adding rtom field for consistency with the model
      }));
      
      return transformedRTOMs;
    } else {
      console.error("API Error:", response.data?.message || "Unexpected response structure");
      return [];
    }
  } catch (error) {
    console.error("Error fetching active RTOMs for DRC:", error.response?.data || error.message);
    return [];
  }
};
