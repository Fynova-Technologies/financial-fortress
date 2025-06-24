import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import dotenv from 'dotenv'

dotenv.config();

const { getAccessTokenSilently } = useAuth0();

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api"
});

api.interceptors.request.use(async (config) => {
  // attach Auth0 access token
  const token = await getAccessTokenSilently();
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
