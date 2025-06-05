import { API_ENDPOINTS } from '../config/api';

export interface SearchResponse {
    success: boolean;
    data?: {
        results: Array<{
            username: string;
            name: string;
            professionalHeadline: string;
            picture: string;
        }>;
        pagination: {
            total_results: number;
            total_pages: number;
            items_per_page: number;
        };
    };
    message?: string;
}

export interface UserDetailsResponse {
    success: boolean;
    data?: {
        name: string;
        professionalHeadline: string;
        summaryOfBio: string;
        location: string;
        picture: string;
        links: Array<any>;
    };
    message?: string;
}

class ApiService {
    async searchUsers(name: string): Promise<SearchResponse> {
        try {
            const response = await fetch(API_ENDPOINTS.SEARCH(name));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching users:', error);
            return {
                success: false,
                message: 'Failed to search users. Please try again.'
            };
        }
    }

    async getUserDetails(username: string): Promise<UserDetailsResponse> {
        try {
            const response = await fetch(API_ENDPOINTS.USER_DETAILS(username));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            return {
                success: false,
                message: 'Failed to fetch user details. Please try again.'
            };
        }
    }

    async testConnection(): Promise<{ message: string }> {
        try {
            const response = await fetch(API_ENDPOINTS.TEST);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error testing connection:', error);
            return {
                message: 'Failed to connect to the backend.'
            };
        }
    }
}

export const apiService = new ApiService(); 