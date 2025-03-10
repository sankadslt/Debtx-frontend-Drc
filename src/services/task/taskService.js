import axios from "axios";
import { getUserData } from "../auth/authService";

const BASE_URL = import.meta.env.VITE_BASE_URL; 
const TASK_URL = `${BASE_URL}/task`;


// export const Create_Task = async (filteredParams) => {
//   try {
//     const user = await getUserData();
//     const taskData = {
//       Template_Task_Id: 24,
//       task_type: "Create Collect Only CPE List for Download",
//       Created_By: user.user_id, 
//       task_status: "open",
//       ...filteredParams,
//     };

//     const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating task:", error);
//     throw error.response?.data || error;
//   }
// };

export const Create_Task = async (filteredParams) => {
  try {
    const user = await getUserData();


    const taskData = {
      Template_Task_Id: 24,
      task_type: "Create Collect Only CPE List for Download",
      Created_By: user.user_id,
      task_status: "open",
      ...filteredParams,
    };

    const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
    return response; // Changed to return the full response instead of response.data
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message); // Updated error handling
    throw error.response?.data || error; 
  }
};


export const Task_for_Download_Incidents = async (incidentData) => {
    try {
        const response = await axios.post(`${TASK_URL}/Task_for_Download_Incidents`, incidentData);
        return response.data;
    } catch (error) {
        console.error("Error creating incident:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
  };

  export const Create_Task_for_OpenNoAgent = async (filteredParams) => {
    try {
      const user = await getUserData();
      const taskData = {
       
        
        Template_Task_Id: 21,
        task_type: "Create incident open for distribution download",
        Created_By: user.user_id,  
        task_status: "open",
        Incident_Status: "Open No Agent",
        proceed_Dtm: "null",
        ...filteredParams,
      };
  
      const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error.response?.data || error;
    }
  };

  export const Create_Task_for_Create_CaseFromIncident = async (filteredParams) => {
    try {
      const user = await getUserData();
      const taskData = {
        Template_Task_Id: 15,
        task_type: "Create Case from Incident Direct NO Agent",
        Created_By: user.user_id,  
        task_status: "open",
        Incident_Status: "Open No Agent",
        ...filteredParams,
      };
  
      const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
      return response;
    } catch (error) {
      console.error("Error creating task:", error.message || error);
      throw error.response?.data || error;
    }
  };
  
  export const Create_Task_for_Forward_CPECollect = async (filteredParams) => {
    try {
    const user = await getUserData();
      const taskData = {
        Template_Task_Id: 17,
        task_type: "Create Case from Incident Open CPE Collect",
        Created_By: user.user_id,  
        task_status: "open",
        Incident_Status: "Open CPE Collect",
        ...filteredParams,
      };
  
      const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
      return response;
    } catch (error) {
      console.error("Error creating task:", error.message || error);
      throw error.response?.data || error;
    }
  };
  
  export const Open_Task_Count_Forward_CPE_Collect = async () => { 
    try {
      const user = await getUserData();
        const taskData = {
            Template_Task_Id: 17, 
            task_type: "Create Case from Incident Open CPE Collect",
            Created_By: user.user_id,  
        };
          
        const response = await axios.post(`${TASK_URL}/Open_Task_Count`, taskData);
        return response.data.openTaskCount; 
    } catch (error) {
        console.error("Error fetching open task count:", error.response?.data || error.message);
        throw error.response?.data || error; 
      }
  }

  export const Open_Task_Count_Incident_To_Case = async () => { 
    try {
      const user = await getUserData();
        const taskData = {
            Template_Task_Id: 15, 
            Created_By: user.user_id,  
            task_type: "Create Case from Incident Direct NO Agent",
        };
        const response = await axios.post(`${TASK_URL}/Open_Task_Count`, taskData);
        return response.data.openTaskCount; 
    } catch (error) {
        console.error("Error fetching open task count:", error.response?.data || error.message);
        throw error.response?.data || error; 
      }
  }