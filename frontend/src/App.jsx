import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    try {
      const r = await fetch(`${API_BASE}/api/tasks`);
      if (!r.ok) throw new Error("Failed to load tasks");
      setTasks(await r.json());
    } catch (e) {
      setError(String(e.message || e));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;

    setError("");
    try {
      const r = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || "Failed to add task");
      }
      const created = await r.json();
      setTasks((prev) => [created, ...prev]);
      setTitle("");
    } catch (e) {
      setError(String(e.message || e));
    }
  }

  async function toggle(id) {
    setError("");
    try {
      const r = await fetch(`${API_BASE}/api/tasks/${id}/toggle`, { method: "PATCH" });
      if (!r.ok) throw new Error("Failed to toggle");
      const updated = await r.json();
      setTasks((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      setError(String(e.message || e));
    }
  }

  async function remove(id) {
    setError("");
    try {
      const r = await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
      if (!r.ok && r.status !== 204) throw new Error("Failed to delete");
      setTasks((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setError(String(e.message || e));
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Simple Fullstack: Tasks</h1>

      <form onSubmit={addTask} style={{ display: "flex", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          style={{ flex: 1, padding: 10 }}
        />
        <button style={{ padding: "10px 16px" }}>Add</button>
      </form>

      {error && <p style={{ color: "crimson", marginTop: 12 }}>Error: {error}</p>}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span style={{ flex: 1, textDecoration: t.done ? "line-through" : "none" }}>
              {t.title}
            </span>
            <button onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
