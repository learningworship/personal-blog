import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts/${slug}`);
      setPost(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Post not found');
      } else {
        setError('Failed to load post');
      }
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Row>
          <Col>
            <Alert variant="danger">
              <Alert.Heading>Oops!</Alert.Heading>
              <p>{error}</p>
              <hr />
              <Link to="/" className="btn btn-outline-primary">
                Back to Home
              </Link>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="blog-post">
            <Card.Body className="blog-post-content">
              <div className="blog-post-meta mb-3">
                By {post.author} • {formatDate(post.created_at)}
                {post.updated_at !== post.created_at && (
                  <span> • Updated {formatDate(post.updated_at)}</span>
                )}
              </div>
              
              <h1 className="display-5 fw-bold mb-4">{post.title}</h1>
              
              {post.excerpt && (
                <div className="lead text-muted mb-4">
                  {post.excerpt}
                </div>
              )}
              
              <div className="post-content">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-outline-primary">
              ← Back to All Posts
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Post;
