import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Root route (just to check server is running)
app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Supabase Auth Server Running</h1>
    <p>Available endpoints:</p>
    <ul>
      <li>POST <code>/signup</code> → { "email": "test@gmail.com", "password": "123456" }</li>
      <li>POST <code>/login</code> → { "email": "test@gmail.com", "password": "123456" }</li>
      <li>GET <code>/profile</code> → Authorization: Bearer &lt;token&gt;</li>
    </ul>
  `);
});

// Signup API
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ user: data.user });
});

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ user: data.user, session: data.session });
});

// Example Protected Route
app.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "No token provided" });

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).js  on({ error: error.message })

  res.json({ user: data.user });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
