import axios from 'axios';

// Detect whether to use direct backend URL or relative proxy path
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/students';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const studentService = {
  // Get all students
  getAll: async () => {
    const response = await apiClient.get('');
    return response.data;
  },

  // Get student by database ID
  getById: async (id) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  // Search by Roll Number
  getByRollNumber: async (rollNumber) => {
    const response = await apiClient.get(`/roll/${encodeURIComponent(rollNumber.trim())}`);
    return response.data;
  },

  // Search by query (roll number, name, or branch)
  search: async (query) => {
    const response = await apiClient.get(`/search?q=${encodeURIComponent(query.trim())}`);
    return response.data;
  },

  // Get total student count
  getCount: async () => {
    const response = await apiClient.get('/count');
    return response.data;
  },

  // Get aggregated statistics
  getStats: async () => {
    const response = await apiClient.get('/stats');
    return response.data;
  },

  // Add new student
  create: async (studentData) => {
    const response = await apiClient.post('', studentData);
    return response.data;
  },

  // Update existing student
  update: async (id, studentData) => {
    const response = await apiClient.put(`/${id}`, studentData);
    return response.data;
  },

  // Delete student
  delete: async (id) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },
};

export default studentService;
