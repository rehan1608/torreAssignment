import { useState, useCallback } from 'react';
import { apiService, SearchResponse, UserDetailsResponse } from '../services/api';

interface SearchState {
    isLoading: boolean;
    error: string | null;
    searchResults: SearchResponse['data'] | null;
    selectedUser: UserDetailsResponse['data'] | null;
}

export const useSearch = () => {
    const [state, setState] = useState<SearchState>({
        isLoading: false,
        error: null,
        searchResults: null,
        selectedUser: null
    });

    const searchUsers = useCallback(async (name: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await apiService.searchUsers(name);
            if (response.success) {
                setState(prev => ({
                    ...prev,
                    searchResults: response.data || null,
                    error: null
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    error: response.message || 'Failed to search users'
                }));
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'An unexpected error occurred'
            }));
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const getUserDetails = useCallback(async (username: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await apiService.getUserDetails(username);
            if (response.success) {
                setState(prev => ({
                    ...prev,
                    selectedUser: response.data || null,
                    error: null
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    error: response.message || 'Failed to fetch user details'
                }));
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'An unexpected error occurred'
            }));
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const clearSearch = useCallback(() => {
        setState({
            isLoading: false,
            error: null,
            searchResults: null,
            selectedUser: null
        });
    }, []);

    return {
        ...state,
        searchUsers,
        getUserDetails,
        clearSearch
    };
}; 