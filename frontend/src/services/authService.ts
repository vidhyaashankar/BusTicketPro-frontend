import axios from "axios";

const API_URL = "/api/auth";

export const authService = {
  async register(data: any) {
    const res = await axios.post(`${API_URL}/register`, data);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },

  async login(data: any) {
    const res = await axios.post(`${API_URL}/login`, data);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },

  async me() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      localStorage.removeItem("token");
      return null;
    }
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  }
};
