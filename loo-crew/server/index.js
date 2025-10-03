require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./lib/db");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/restrooms", (req, res) => {
  try {
    const filters = [];
    const params = {};

    if (req.query.type) {
      filters.push("type = @type");
      params.type = req.query.type;
    }

    if (req.query.minCleanliness) {
      filters.push("cleanliness >= @minCleanliness");
      params.minCleanliness = Number(req.query.minCleanliness);
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const restrooms = db.all(
      `SELECT id, name, description, latitude, longitude, type, access_notes, cleanliness, created_at, updated_at
       FROM restrooms
       ${where}
       ORDER BY cleanliness DESC, name ASC`,
      params
    );

    res.json({ data: restrooms });
  } catch (error) {
    console.error("Failed to fetch restrooms", error);
    res.status(500).json({ error: "Failed to fetch restrooms" });
  }
});

app.post("/api/restrooms", (req, res) => {
  const { name, description, latitude, longitude, type, accessNotes, cleanliness } = req.body;

  if (!name || typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({ error: "name, latitude, and longitude are required" });
  }

  try {
    const result = db.run(
      `INSERT INTO restrooms (name, description, latitude, longitude, type, access_notes, cleanliness, updated_at)
       VALUES (@name, @description, @latitude, @longitude, @type, @accessNotes, COALESCE(@cleanliness, 0), CURRENT_TIMESTAMP)`,
      {
        name,
        description,
        latitude,
        longitude,
        type: type || "public",
        accessNotes: accessNotes || null,
        cleanliness: typeof cleanliness === "number" ? cleanliness : null
      }
    );

    const created = db.get(
      `SELECT id, name, description, latitude, longitude, type, access_notes, cleanliness, created_at, updated_at
       FROM restrooms
       WHERE id = @id`,
      { id: result.lastInsertRowid }
    );

    res.status(201).json({ data: created });
  } catch (error) {
    console.error("Failed to create restroom", error);
    res.status(500).json({ error: "Failed to create restroom" });
  }
});

app.get("/api/restrooms/:id", (req, res) => {
  try {
    const restroom = db.get(
      `SELECT id, name, description, latitude, longitude, type, access_notes, cleanliness, created_at, updated_at
       FROM restrooms
       WHERE id = @id`,
      { id: Number(req.params.id) }
    );

    if (!restroom) {
      return res.status(404).json({ error: "Restroom not found" });
    }

    const reviews = db.all(
      `SELECT id, rating, cleanliness, smell, privacy, supplies, comment, created_at
       FROM reviews
       WHERE restroom_id = @id
       ORDER BY created_at DESC`,
      { id: restroom.id }
    );

    const checkins = db.all(
      `SELECT id, username, message, visibility, created_at
       FROM checkins
       WHERE restroom_id = @id
       ORDER BY created_at DESC`,
      { id: restroom.id }
    );

    res.json({ data: { restroom, reviews, checkins } });
  } catch (error) {
    console.error("Failed to load restroom", error);
    res.status(500).json({ error: "Failed to load restroom" });
  }
});

app.post("/api/restrooms/:id/checkins", (req, res) => {
  const { username, message, visibility } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    const restroomId = Number(req.params.id);
    const restroom = db.get(`SELECT id FROM restrooms WHERE id = @id`, { id: restroomId });

    if (!restroom) {
      return res.status(404).json({ error: "Restroom not found" });
    }

    const result = db.run(
      `INSERT INTO checkins (restroom_id, username, message, visibility)
       VALUES (@restroomId, @username, @message, @visibility)`,
      {
        restroomId,
        username,
        message: message || null,
        visibility: visibility || "friends"
      }
    );

    const created = db.get(
      `SELECT id, username, message, visibility, created_at
       FROM checkins
       WHERE id = @id`,
      { id: result.lastInsertRowid }
    );

    res.status(201).json({ data: created });
  } catch (error) {
    console.error("Failed to create check-in", error);
    res.status(500).json({ error: "Failed to create check-in" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`LooCrew API listening on port ${port}`);
});
