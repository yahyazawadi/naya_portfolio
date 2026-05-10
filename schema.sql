CREATE TABLE IF NOT EXISTS portfolio_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  cover_image TEXT NOT NULL,
  images TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_groups(category);
