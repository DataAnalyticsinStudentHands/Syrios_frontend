import axios from "axios";

export const makeRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // baseURL: process.env.REACT_APP_API_URL_LOCAL,
//   headers: {
//     Authorization: "bearer " + process.env.REACT_APP_API_TOKEN,
//   },
});