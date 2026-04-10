/**
 * makeRequest.js
 * Vite migration:
 * - Replace process.env.REACT_APP_* with import.meta.env.VITE_*
 * - Ensure variables are prefixed with VITE_ in .env files
 */

import axios from "axios";

export const makeRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: import.meta.env.VITE_API_URL_LOCAL,
  // headers: {
  //   Authorization: "bearer " + import.meta.env.VITE_API_TOKEN,
  // },
});