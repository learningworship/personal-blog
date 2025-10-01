// PostgreSQL database configuration
const { Pool } = require('pg');
const logger = require('../utils/logger');

  // SSL configuration: Use DB_SSL env variable for fine control
  // Set DB_SSL=true in production when your database requires SSL
  let sslConfig = false;
  if (process.env.DB_SSL === 'true') {
    sslConfig = { rejectUnauthorized: false };
  }

  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'blog_db',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: sslConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Test database connection
  const connect = async () => {
    try {
      const client = await pool.connect();
      logger.info('Connected to PostgreSQL database');
      
      // Initialize database tables
      await initializeTables(client);
      
      client.release();
      return true;
    } catch (err) {
      logger.error('Database connection error:', err);
      throw err;
    }
  };

  // Initialize database tables
  const initializeTables = async (client) => {
    try {
      // Create posts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT,
          slug VARCHAR(255) UNIQUE NOT NULL,
          author VARCHAR(100) NOT NULL,
          published BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create users table for authentication
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
        CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
        CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
      `);

      logger.info('Database tables initialized successfully');
    } catch (err) {
      logger.error('Error initializing database tables:', err);
      throw err;
    }
  };

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Only log in development or if duration is high
    if (process.env.NODE_ENV !== 'production' || duration > 1000) {
      logger.debug('Executed query', { 
        text: text.substring(0, 100), // Only log first 100 chars
        duration, 
        rows: res.rowCount 
      });
    }
    
    return res;
  } catch (err) {
    logger.error('Database query error:', { error: err.message, query: text });
    throw err;
  }
};

module.exports = {
  pool,
  connect,
  query
};
