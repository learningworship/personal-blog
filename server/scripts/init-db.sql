-- Initialize blog database with sample data
-- This script sets up the database schema and inserts sample data

-- Create posts table
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
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_title ON posts(title);
CREATE INDEX IF NOT EXISTS idx_posts_content ON posts USING gin(to_tsvector('english', content));

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role) 
VALUES (
    'admin', 
    'admin@example.com', 
    '$2a$12$3NCr4hCPza5QHxjJp/dKyOkjyaQKI5TnMj9mMtY/EN4nXGX2c/pbi', 
    'admin'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample blog posts
INSERT INTO posts (title, content, excerpt, slug, author, published, created_at) VALUES 
(
    'Welcome to My Blog',
    '# Welcome to My Blog

This is my first blog post! I''m excited to share my thoughts and experiences with you.

## What You Can Expect

- **Technology insights**: I''ll share my experiences with various technologies
- **Tutorials**: Step-by-step guides for common development tasks
- **Personal stories**: Lessons learned from my journey as a developer

## Getting Started

Feel free to explore the blog and don''t hesitate to reach out if you have any questions!

Happy reading! 🚀',
    'Welcome to my personal blog where I share thoughts, experiences, and insights on technology and life.',
    'welcome-to-my-blog',
    'admin',
    true,
    NOW() - INTERVAL '2 days'
),
(
    'Building a Modern Web Application',
    '# Building a Modern Web Application

Building modern web applications requires careful consideration of several factors:

## Key Components

1. **Frontend Framework**: React, Vue, or Angular
2. **Backend API**: Node.js, Python, or Java
3. **Database**: PostgreSQL, MongoDB, or MySQL
4. **Deployment**: Docker, Kubernetes, or cloud platforms

## Best Practices

- Use TypeScript for better type safety
- Implement proper error handling
- Write comprehensive tests
- Follow security best practices

## Conclusion

Modern web development is exciting and constantly evolving. Stay curious and keep learning!',
    'Learn about the essential components and best practices for building modern web applications.',
    'building-modern-web-application',
    'admin',
    true,
    NOW() - INTERVAL '1 day'
),
(
    'The Future of Web Development',
    '# The Future of Web Development

Web development is evolving rapidly, and it''s important to stay ahead of the curve.

## Emerging Trends

- **WebAssembly**: High-performance applications in the browser
- **Progressive Web Apps**: Native app-like experiences
- **Serverless Architecture**: Scalable and cost-effective solutions
- **AI Integration**: Machine learning in web applications

## Staying Current

To stay current in web development:

1. Follow industry blogs and newsletters
2. Participate in online communities
3. Build side projects
4. Attend conferences and meetups

The future is bright for web developers! 🌟',
    'Exploring the latest trends and technologies shaping the future of web development.',
    'future-of-web-development',
    'admin',
    true,
    NOW()
),
(
    'Draft: Upcoming Project',
    '# Upcoming Project

This is a draft post about an exciting project I''m working on.

## Project Details

- **Technology Stack**: React, Node.js, PostgreSQL
- **Features**: Real-time updates, user authentication
- **Timeline**: 3 months

## Next Steps

- Complete the design phase
- Set up the development environment
- Begin implementation

Stay tuned for more updates!',
    'A sneak peek at an exciting project in development.',
    'upcoming-project',
    'admin',
    false,
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (commented out for Supabase - permissions are managed by Supabase)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO blog_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO blog_user;
