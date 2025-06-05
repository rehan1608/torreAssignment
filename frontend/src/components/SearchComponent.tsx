import React, { useState } from 'react';
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
  IconButton,
  Pagination,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { Search as SearchIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSearch } from '../hooks/useSearch';

const SearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    isLoading,
    error,
    searchResults,
    selectedUser,
    searchUsers,
    getUserDetails,
    clearSearch
  } = useSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchUsers(searchQuery.trim());
      setPage(1);
    }
  };

  const handleUserClick = async (username: string) => {
    await getUserDetails(username);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    clearSearch();
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
            disabled={isLoading}
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

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleCloseDialog} size="small">
            <ArrowBackIcon />
          </IconButton>
          {selectedUser?.name}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={selectedUser.picture}
                alt={selectedUser.name}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                {selectedUser.professionalHeadline}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {selectedUser.location}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedUser.summaryOfBio}
              </Typography>
              {selectedUser.links && (
                <Box sx={{ mt: 2 }}>
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchComponent; 