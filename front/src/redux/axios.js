import axios from "axios";

const baseDevApi = "http://localhost:5000/events-app-489e8/europe-west1/api";
const baseProdApi = "";

const isInDevelopment = process.env.NODE_ENV === "development";

const api = axios.create({
  baseURL: isInDevelopment ? baseDevApi : baseProdApi,
  responseType: "json",
});

export default api;