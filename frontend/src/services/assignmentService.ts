import axios from "axios";
import { Assignment } from "../types/assignment";

const API = "http://127.0.0.1:8000/assignment";
const token = localStorage.getItem("access_token");

export const fetchAssignments = async (): Promise<Assignment[]> => {
  const res = await axios.get(`${API}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createAssignment = async (data: FormData) => {
  const res = axios.post(`${API}/`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  return res;
};

export const updateAssignment = async (id: number, data: FormData) => {
  return axios.put(`${API}/update/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
};


