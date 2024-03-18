import axios from "axios";
import headers from "next/headers";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${token}`
  }
});

export default apiClient;
