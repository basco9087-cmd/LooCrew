import axios from "axios";

const client = axios.create({
  baseURL: "/api"
});

export const fetchRestrooms = async (params = {}) => {
  const response = await client.get("/restrooms", { params });
  return response.data.data;
};

export const fetchRestroomDetail = async (id) => {
  const response = await client.get(`/restrooms/${id}`);
  return response.data.data;
};

export const createCheckIn = async (id, payload) => {
  const response = await client.post(`/restrooms/${id}/checkins`, payload);
  return response.data.data;
};

export default client;
