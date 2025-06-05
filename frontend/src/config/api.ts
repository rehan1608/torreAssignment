export const API_BASE_URL = 'https://searchnametorre-production.up.railway.app';

export const API_ENDPOINTS = {
    SEARCH: (name: string) => `${API_BASE_URL}/api/search/${name}`,
    USER_DETAILS: (username: string) => `${API_BASE_URL}/api/user/${username}`,
    TEST: `${API_BASE_URL}/api/search/test`
}; 