import axios from "axios";


export const fetchAuditData = async (url) => {
  try {
    const response = await axios.post(`/api/audit`, { url });
    return response.data;
  } catch (error) {
    const status = error.response?.status || 404;
    const message =
      error.response?.data?.error || "Invalid URL or Website Not Found";

    const customError = new Error(message);
    customError.status = status;
    throw customError;
  }
};
