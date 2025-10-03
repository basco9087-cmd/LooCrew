const schema = `
CREATE TABLE IF NOT EXISTS restrooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  type TEXT DEFAULT "public",
  access_notes TEXT,
  cleanliness INTEGER CHECK (cleanliness BETWEEN 0 AND 5) DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restroom_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  cleanliness INTEGER CHECK (cleanliness BETWEEN 1 AND 5),
  smell INTEGER CHECK (smell BETWEEN 1 AND 5),
  privacy INTEGER CHECK (privacy BETWEEN 1 AND 5),
  supplies INTEGER CHECK (supplies BETWEEN 1 AND 5),
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restroom_id) REFERENCES restrooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restroom_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  message TEXT,
  visibility TEXT NOT NULL DEFAULT "friends",
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restroom_id) REFERENCES restrooms(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reviews_restroom_id ON reviews(restroom_id);
CREATE INDEX IF NOT EXISTS idx_checkins_restroom_id ON checkins(restroom_id);
`;

const seed = `
INSERT OR IGNORE INTO restrooms (id, name, description, latitude, longitude, type, access_notes, cleanliness)
VALUES
  (1, "Starbucks Orchard", "Reliable cafe restroom with door code access.", 1.3001, 103.8372, "cafe", "Ask the barista for the keypad code.", 4),
  (2, "City Hall Public Loo", "Spacious public restroom with attendants.", 1.2925, 103.8520, "public", "Free entry, cleaned hourly.", 5),
  (3, "Mall Oasis Level 3", "Quiet mall restroom near the cinema.", 1.3031, 103.8310, "mall", "Follow signage past the arcade.", 3);

INSERT OR IGNORE INTO reviews (id, restroom_id, rating, cleanliness, smell, privacy, supplies, comment)
VALUES
  (1, 1, 4, 4, 3, 4, 5, "Solid option before a long commute."),
  (2, 2, 5, 5, 5, 4, 5, "Pristine and stocked with paper."),
  (3, 3, 3, 3, 3, 4, 3, "Gets busy on weekends but still reliable.");

INSERT OR IGNORE INTO checkins (id, restroom_id, username, message, visibility)
VALUES
  (1, 2, "logan", "Crisis averted. Sparkling clean!", "friends"),
  (2, 1, "tina", "Saved by the latte stop.", "friends"),
  (3, 3, "devon", "Movie break success.", "private");
`;

module.exports = {
  schema,
  seed
};
