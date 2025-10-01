// API configuration based on environment
const getApiUrl = () => {
    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      // In production, use same domain (Express serves both API and static files)
      // Empty string means relative URLs like '/api/posts'
      return process.env.REACT_APP_API_URL || '';
    }
    
    // Development: use proxy configured in package.json
    return '';
  };
  
  export const API_URL = getApiUrl();
  
  // Export default axios config
  export const axiosConfig = {
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  };