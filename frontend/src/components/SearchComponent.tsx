import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Avatar,
  Pagination,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSearch } from '../hooks/useSearch';

const SearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isDetailView, setIsDetailView] = useState(false);
  
  const {
    isLoading,
    error,
    searchResults,
    selectedUser,
    searchUsers,
    getUserDetails,
    clearSearch,
  } = useSearch();

  useEffect(() => {
    if (!searchQuery.trim()) {
      clearSearch();
    }
  }, [searchQuery, clearSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage(1);
      await searchUsers(searchQuery.trim());
    } else {
      clearSearch();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (!newValue.trim()) {
      clearSearch();
    }
  };

  const handleUserClick = async (username: string) => {
    await getUserDetails(username);
    setIsDetailView(true);
  };

  const handleBackToSearch = () => {
    setIsDetailView(false);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const itemsPerPage = 5;
  const totalPages = searchResults?.pagination?.total_pages || 1;

  const getCurrentPageItems = () => {
    if (!searchResults?.results) return [];
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return searchResults.results.slice(start, end);
  };

  const showPagination = searchResults?.results && searchResults.results.length > 0;

  if (isDetailView && selectedUser) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToSearch}
          variant="contained"
          sx={{ mb: 3 }}
        >
          Back to Search
        </Button>
        <Card sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              src={selectedUser.picture}
              alt={selectedUser.name}
              sx={{ width: 150, height: 150, mx: 'auto', mb: 3 }}
            />
            <Typography variant="h4" gutterBottom>
              {selectedUser.name}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
              {selectedUser.professionalHeadline}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {selectedUser.location}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              {selectedUser.summaryOfBio}
            </Typography>
            {selectedUser.links && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Links
                </Typography>
                {selectedUser.links.map((link) => (
                  <Button
                    key={link.id}
                    href={link.address}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                    sx={{ m: 0.5 }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: 'white', mb: 4 }}>
        Torre Search
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name (e.g. John)..."
            variant="outlined"
            sx={{ 
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !searchQuery.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            sx={{ px: 4 }}
          >
            Search
          </Button>
        </Box>
      </form>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {searchQuery.trim() && searchResults?.results && searchResults.results.length === 0 && (
        <Typography align="center" sx={{ color: 'white', mt: 4 }}>
          No results found for "{searchQuery}"
        </Typography>
      )}

      {searchResults?.results && searchResults.results.length > 0 && (
        <>
          <Grid container spacing={2}>
            {getCurrentPageItems().map((person) => (
              <Grid item xs={12} key={person.username}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'scale(1.01)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                  onClick={() => handleUserClick(person.username)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={person.picture}
                      alt={person.name}
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box>
                      <Typography variant="h6">{person.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {person.professionalHeadline}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {showPagination && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ 
                  '& .MuiPaginationItem-root': {
                    color: 'white',
                    '&.Mui-selected': {
                      backgroundColor: 'white',
                      color: 'primary.main',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchComponent; 