import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/DRC`;


export const List_DRC_Details_By_DRC_ID = async (payload) => {
    try {
        const response = await axios.post(`${URL}/List_DRC_Details_By_DRC_ID`, payload);

        if (response.data.status === 'success') {
            return response.data;
        } else {
            console.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error Getting details of DRC:", error.message);
        throw error;
    }
};