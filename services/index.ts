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
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("token", token);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default baseAxios;
