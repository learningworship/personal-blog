const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all published posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = 'SELECT * FROM posts WHERE published = true';
    let params = [];
    let paramCount = 0;

    if (search) {
      query += ' AND (title ILIKE $' + (++paramCount) + ' OR content ILIKE $' + (++paramCount) + ')';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Get total count for pagination (without ORDER BY)
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await db.query(countQuery, params);
    const totalPosts = parseInt(countResult.rows[0].count);

    // Add ORDER BY and pagination
    query += ' ORDER BY created_at DESC';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT $' + (++paramCount) + ' OFFSET $' + (++paramCount);
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);
    const totalPages = Math.ceil(totalPosts / parseInt(limit));
    
    res.json({
      posts: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalPosts: totalPosts,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Get all posts (admin only)
router.get('/admin', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = 'SELECT * FROM posts';
    let params = [];
    let paramCount = 0;

    if (search) {
      query += ' WHERE (title ILIKE $' + (++paramCount) + ' OR content ILIKE $' + (++paramCount) + ')';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Get total count for pagination (without ORDER BY)
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await db.query(countQuery, params);
    const totalPosts = parseInt(countResult.rows[0].count);

    // Add ORDER BY and pagination
    query += ' ORDER BY created_at DESC';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT $' + (++paramCount) + ' OFFSET $' + (++paramCount);
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);
    const totalPages = Math.ceil(totalPosts / parseInt(limit));
    
    res.json({
      posts: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalPosts: totalPosts,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db.query('SELECT * FROM posts WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// Create new post
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, slug, author, published = false } = req.body;
    
    // Auto-generate slug if not provided
    let postSlug = slug;
    if (!postSlug) {
      postSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens
      
      // Add timestamp to ensure uniqueness
      postSlug += '-' + Date.now();
    }
    
    const result = await db.query(
      'INSERT INTO posts (title, content, excerpt, slug, author, published) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, content, excerpt, postSlug, author, published]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating post:', err);
    if (err.code === '23505') { // Unique constraint violation
      res.status(400).json({ message: 'Slug already exists' });
    } else {
      res.status(500).json({ message: 'Error creating post' });
    }
  }
});

// Update post
router.put('/:id', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, excerpt, slug, author, published } = req.body;
    
    // Auto-generate slug if not provided
    let postSlug = slug;
    if (!postSlug) {
      postSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens
      
      // Add timestamp to ensure uniqueness
      postSlug += '-' + Date.now();
    }
    
    const result = await db.query(
      'UPDATE posts SET title = $1, content = $2, excerpt = $3, slug = $4, author = $5, published = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [title, content, excerpt, postSlug, author, published, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating post:', err);
    if (err.code === '23505') { // Unique constraint violation
      res.status(400).json({ message: 'Slug already exists' });
    } else {
      res.status(500).json({ message: 'Error updating post' });
    }
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

module.exports = router;