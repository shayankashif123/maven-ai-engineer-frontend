import axios from 'axios';
import process from 'process';
const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL: '', // Requests will be relative, e.g. /api/chat, handled by Next.js rewrites
});

export default api;

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  // Note: Adjust endpoint if backend path is different, e.g. /rag/upload
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const chatWithDocument = async (query: string) => {
  const response = await api.post('/api/chat', { query });
  return response.data;
};