import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXTwitter,
  faGithub,
  faLinkedin,
  faInstagram,
  faFacebook,
  faMedium,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';


interface Person {
  username: string;
  name: string;
  professionalHeadline: string;
  picture: string;
}

interface SocialLink {
  id: string;
  name: string;
  address: string;
}

interface DetailedPerson extends Person {
  summaryOfBio: string;
  location: string;
  links?: SocialLink[];
}

interface PaginationInfo {
  total_results: number;
  total_pages: number;
  items_per_page: number;
}

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://torre-backend.onrender.com'
  : 'http://localhost:5000';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<DetailedPerson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    // Reset states
    setError(null);
    setSearchResults([]);
    setSelectedPerson(null);
    setHasSearched(true);
    setCurrentPage(1);

    if (!trimmedQuery) {
      setError('Please enter a name to search');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/search/${encodeURIComponent(trimmedQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data.results);
        setPaginationInfo(data.data.pagination);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Reset results if input is cleared
    if (!value.trim()) {
      setSearchResults([]);
      setError(null);
      setHasSearched(false);
      setPaginationInfo(null);
      setCurrentPage(1);
    }
  };

  const handlePersonClick = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/${username}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedPerson(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedPerson(null);
    setError(null);
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return searchResults.slice(startIndex, endIndex);
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    if (!paginationInfo) return [];
    
    const totalPages = paginationInfo.total_pages;
    const current = currentPage;
    const delta = 2; // Number of pages to show before and after current page
    
    let pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    if (current > delta + 2) {
      pages.push('...');
    }
    
    // Calculate range around current page
    const rangeStart = Math.max(2, current - delta);
    const rangeEnd = Math.min(totalPages - 1, current + delta);
    
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    if (current < totalPages - (delta + 1)) {
      pages.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Remove duplicates
    pages = Array.from(new Set(pages));
    
    return pages;
  };

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'twitter':
        return <FontAwesomeIcon icon={faXTwitter} />;
      case 'github':
        return <FontAwesomeIcon icon={faGithub} />;
      case 'linkedin':
        return <FontAwesomeIcon icon={faLinkedin} />;
      case 'instagram':
        return <FontAwesomeIcon icon={faInstagram} />;
      case 'facebook':
        return <FontAwesomeIcon icon={faFacebook} />;
      case 'medium':
        return <FontAwesomeIcon icon={faMedium} />;
      case 'youtube':
        return <FontAwesomeIcon icon={faYoutube} />;
      default:
        return '🔗'; // Using emoji as fallback instead of FontAwesome icon
    }
  };

  const formatSocialLink = (link: SocialLink) => {
    if (!link.address) return null;

    // If the address is just a username (like in Medium), construct the full URL
    if (!link.address.startsWith('http')) {
      switch (link.name.toLowerCase()) {
        case 'medium':
          return `https://medium.com/@${link.address}`;
        case 'twitter':
          return `https://twitter.com/${link.address}`;
        case 'instagram':
          return `https://instagram.com/${link.address}`;
        case 'github':
          return `https://github.com/${link.address}`;
        default:
          return link.address;
      }
    }
    return link.address;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Torre Search</h1>
        {!selectedPerson && (
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search by name (e.g. John)..."
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        )}

        {loading && <div className="loading">Loading...</div>}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!selectedPerson && searchResults.length > 0 && (
          <>
            <div className="results-list">
              {getCurrentPageItems().map((person) => (
                <div
                  key={person.username}
                  className="person-card"
                  onClick={() => handlePersonClick(person.username)}
                >
                  <div className="person-card-content">
                    {person.picture ? (
                      <img
                        src={person.picture}
                        alt={person.name}
                        className="person-card-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/defaultProfile.png';
                        }}
                      />
                    ) : (
                      <img
                        src="/images/defaultProfile.png"
                        alt="Default profile"
                        className="person-card-image"
                      />
                    )}
                    <div className="person-card-info">
                      <h3>{person.name}</h3>
                      <p className="person-card-headline">{person.professionalHeadline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {paginationInfo && paginationInfo.total_pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                
                <div className="page-numbers">
                  {getPageNumbers().map((number, index) => (
                    number === '...' ? (
                      <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                    ) : (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number as number)}
                        className={`page-number ${currentPage === number ? 'active' : ''}`}
                      >
                        {number}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(paginationInfo.total_pages, prev + 1))}
                  disabled={currentPage === paginationInfo.total_pages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {selectedPerson && (
          <div className="detail-container">
            <button onClick={handleBack} className="back-button">
              Back to Search
            </button>
            {selectedPerson.picture ? (
              <img
                src={selectedPerson.picture}
                alt={selectedPerson.name}
                className="profile-picture"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/defaultProfile.png';
                }}
              />
            ) : (
              <img
                src="/images/defaultProfile.png"
                alt="Default profile"
                className="profile-picture"
              />
            )}
            <h2>{selectedPerson.name}</h2>
            <p className="headline">{selectedPerson.professionalHeadline}</p>
            <p className="location">{selectedPerson.location}</p>
            
            {selectedPerson.links && selectedPerson.links.length > 0 && (
              <div className="social-links">
                {selectedPerson.links.map(link => {
                  const formattedLink = formatSocialLink(link);
                  if (!formattedLink) return null;
                  
                  return (
                    <a
                      key={link.id}
                      href={formattedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-link ${link.name.toLowerCase()}`}
                      title={link.name}
                    >
                      {getSocialIcon(link.name)}
                    </a>
                  );
                })}
              </div>
            )}
            
            <p className="bio">{selectedPerson.summaryOfBio}</p>
          </div>
        )}

        {hasSearched && !loading && searchResults.length === 0 && !error && (
          <div className="no-results">No matching names found</div>
        )}
      </header>
    </div>
  );
}

export default App; 