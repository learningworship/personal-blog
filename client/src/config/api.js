// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '' // In production, API is served from same origin
  : 'http://localhost:5000'; // In development, use proxy or direct URL

export default API_BASE_URL;

