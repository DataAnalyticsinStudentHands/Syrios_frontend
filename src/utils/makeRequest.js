/**
 * Legacy client for public non-Strapi API requests.
 * Vite configuration is public; keep private credentials in backend services.
 * A shared build-time bearer token would be exposed to every visitor.
 * Local endpoint selection and request timeouts remain configurable.
 */

import axios from "axios";

const useLocalApi = import.meta.env.VITE_ENABLE_LOCAL_API === "true";

const baseURL = useLocalApi
  ? import.meta.env.VITE_API_URL_LOCAL || import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_URL;

export const makeRequest = axios.create({
  baseURL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
  withCredentials: false,
});
