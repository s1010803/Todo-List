import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// Register a new user endpoint endpoint /auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // 1. 先檢查 username 是否已存在
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Username already exists" }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    // 新增使用者
    const [userResult] = await db.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    const userId = userResult.insertId; // MySQL 新增後的自動遞增ID

    // 新增預設 todo
    const defaultTodo = "Hello :) Add your first todo!";
    await db.execute("INSERT INTO todos (user_id, task) VALUES (?, ?)", [
      userId,
      defaultTodo,
    ]);

    // create a token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: "Service unavailable" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [getUser] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    const user = getUser[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    console.log(user);
    // then we have a successful authentication
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(503);
  }
});

export default router;
