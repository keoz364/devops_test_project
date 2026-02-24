import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: r.rows[0].ok });
  } catch (e) {
    res.status(500).json({ status: "fail", error: String(e) });
  }
});

app.get("/api/tasks", async (_req, res) => {
  const r = await pool.query(
    "SELECT id, title, done, created_at FROM tasks ORDER BY id DESC"
  );
  res.json(r.rows);
});

app.post("/api/tasks", async (req, res) => {
  const title = (req.body?.title || "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });

  const r = await pool.query(
    "INSERT INTO tasks(title) VALUES($1) RETURNING id, title, done, created_at",
    [title]
  );
  res.status(201).json(r.rows[0]);
});

app.patch("/api/tasks/:id/toggle", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "bad id" });

  const r = await pool.query(
    "UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING id, title, done, created_at",
    [id]
  );
  if (r.rowCount === 0) return res.status(404).json({ error: "not found" });
  res.json(r.rows[0]);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "bad id" });

  const r = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  if (r.rowCount === 0) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
