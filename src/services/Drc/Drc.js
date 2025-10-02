import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/DRC`;

export const List_DRC_Details_By_DRC_ID = async (payload) => {
  try {
    // get token from localStorage
    const token = localStorage.getItem("accessToken");

    const response = await axios.post(
      `${URL}/List_DRC_Details_By_DRC_ID`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // attach JWT
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      return response.data;
    } else {
      console.error(response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(
      "Error Getting details of DRC:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const List_Pre_Negotiation_By_Case_Id = async (payload) => {
  try {
    // get token from localStorage
    const token = localStorage.getItem("accessToken");

    const response = await axios.post(
      `${URL}/List_Pre_Negotiation_By_Case_Id`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // attach JWT
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error withdrawing Pre_Negotoation Details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_Pre_Negotiation = async (payload) => {
  try {
// get token from localStorage
    const token = localStorage.getItem("accessToken");

    const response = await axios.post(
      `${URL}/Create_Pre_Negotiation`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // attach JWT
          "Content-Type": "application/json",
        },
      }
    );

    // return the response status
    return response.data.status;
  } catch (error) {
    console.error(
      "Error creating customer response",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const List_Pre_Negotiation = async (payload) => {
  try {
    // get token from localStorage
    const token = localStorage.getItem("accessToken");

    const response = await axios.post(
      `${URL}/List_Pre_Negotiation_By_Case_Id_EXT_1`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // attach JWT
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error withdrawing Pre_Negotiation Details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
