import axios from "axios";

const baseUrl = "https://driving-school-application.herokuapp.com/";

const baseAxios = axios.create({
  baseURL: baseUrl,
});

export default baseAxios;
