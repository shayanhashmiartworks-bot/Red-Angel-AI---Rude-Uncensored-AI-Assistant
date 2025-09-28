-- Create artworks table for Neon Database
CREATE TABLE IF NOT EXISTS artworks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  badge VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO artworks (title, url, description, badge) VALUES 
('me noice', 'https://i.pinimg.com/73x/72/9a/b5/729ab5d311956865a8b7778490ca506e.jpg', 'A beautiful artwork showcasing artistic talent', 'NEW')
ON CONFLICT DO NOTHING;
