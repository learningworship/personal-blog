import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async (searchQuery = null) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts', {
        params: {
          page: currentPage,
          limit: 6,
          search: searchQuery !== null ? searchQuery : (searchTerm || undefined)
        }
      });
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setIsSearching(true);
    fetchPosts();
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Don't trigger search on every keystroke
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    setIsSearching(true);
    // Fetch all posts by passing empty string as search query
    fetchPosts('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && posts.length === 0) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="blog-header">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold">Welcome to My Blog</h1>
              <p className="lead">Thoughts, stories, and ideas</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          <Col lg={8}>
            {/* Search Form */}
            <Form onSubmit={handleSearch} className="search-form">
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                  />
                </Col>
                <Col md={3}>
                  <Button type="submit" variant="primary" className="w-100" disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    type="button" 
                    variant="outline-secondary" 
                    className="w-100"
                    onClick={handleClearSearch}
                    disabled={isSearching || !searchTerm}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Form>

            {/* Error Message */}
            {error && (
              <Alert variant="danger">{error}</Alert>
            )}

            {/* Posts */}
            {posts.length === 0 && !loading ? (
              <Card>
                <Card.Body className="text-center py-5">
                  <h5>No posts found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for new posts!'}
                  </p>
                </Card.Body>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="blog-post">
                  <Card.Body className="blog-post-content">
                    <div className="blog-post-meta">
                      By {post.author} • {formatDate(post.created_at)}
                    </div>
                    <Card.Title>
                      <Link to={`/post/${post.slug}`} className="blog-post-title">
                        {post.title}
                      </Link>
                    </Card.Title>
                    {post.excerpt && (
                      <Card.Text className="blog-post-excerpt">
                        {post.excerpt}
                      </Card.Text>
                    )}
                    <Link to={`/post/${post.slug}`} className="btn btn-outline-primary">
                      Read More
                    </Link>
                  </Card.Body>
                </Card>
              ))
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav aria-label="Posts pagination">
                <ul className="pagination">
                  <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </Col>

          <Col lg={4}>
            <div className="sidebar">
              <h5>About</h5>
              <p>
                Welcome to my personal blog where I share thoughts, experiences, 
                and insights on various topics. Feel free to explore and engage!
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
