import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8082/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateFabricPattern = async (textPrompt) => {
  try {
    const response = await API.post('/fabric/generate', { text_prompt: textPrompt });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to generate pattern from backend service.';
  }
};

export default API;
