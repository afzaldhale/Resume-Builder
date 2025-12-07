import { db } from "../database.js";

export const signup = (req, res) => {
  const { name, email, password } = req.body;

  const q = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(q, [name, email, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Error creating user" });

    // Fetch the newly created user using the insertId
    const userId = result.insertId;
    const q2 = "SELECT * FROM users WHERE id = ?";
    db.query(q2, [userId], (err2, users) => {
      if (err2) return res.status(500).json({ message: "Error fetching user" });

      res.json({ message: "Signup successful", user: users[0] });
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const q = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(q, [email, password], (err, users) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (users.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user: users[0] });
  });
};
