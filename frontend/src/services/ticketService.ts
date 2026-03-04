import axios from "axios";
import { Ticket, Stats, BookingData } from "../interface/ticket";

const API_URL = "/api/tickets";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    const res = await axios.get(`${API_URL}/all`, { headers: getAuthHeader() });
    return res.data;
  },

  async getByRoute(route: string): Promise<Ticket[]> {
    const res = await axios.get(`${API_URL}/byRoute?route=${encodeURIComponent(route)}`, { headers: getAuthHeader() });
    return res.data;
  },

  async book(data: BookingData): Promise<{ id: number; status: string }> {
    const res = await axios.post(`${API_URL}/book`, data, { headers: getAuthHeader() });
    return res.data;
  },

  async cancel(id: number): Promise<{ message: string }> {
    const res = await axios.put(`${API_URL}/cancel/${id}`, {}, { headers: getAuthHeader() });
    return res.data;
  },

  async getStatistics(): Promise<Stats> {
    const res = await axios.get(`${API_URL}/statistics`, { headers: getAuthHeader() });
    return res.data;
  }
};
