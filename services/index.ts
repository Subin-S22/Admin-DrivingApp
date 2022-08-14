import axios from "axios";

const baseUrl = "https://driving-school-application.herokuapp.com/";

const baseAxios = axios.create({
  baseURL: baseUrl,
});

export const axiosWithAuth = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization:
      typeof window !== "undefined" && localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : "no token",
  },
});

export default baseAxios;
