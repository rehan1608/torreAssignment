export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const endpoints = {
  search: `${API_URL}/search`,
  profile: `${API_URL}/profile`,
}; 