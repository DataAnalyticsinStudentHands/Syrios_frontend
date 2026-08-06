import apiClient from "./client";

const wrapData = (data) => ({ data });

const submissionRequest = {
  contact: (data) => apiClient.post("/api/user-contact-us", wrapData(data)),
  download: (data) => apiClient.post("/api/user-download", wrapData(data)),
  subscription: (data) =>
    apiClient.post("/api/user-subscription", wrapData(data)),
};

export default submissionRequest;
