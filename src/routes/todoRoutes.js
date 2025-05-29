import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all todos for logged-in user
router.get("/", async (req, res) => {
  const userId = req.user.id;

  const [todos] = await db.execute("SELECT * FROM todos WHERE user_id = ?", [
    userId,
  ]);

  res.json(todos);
});

// Create a new todo
router.post("/", async (req, res) => {
  const { task } = req.body;
  const userId = req.user.id;
  const [insertTodo] = await db.execute(
    "INSERT INTO todos (user_id, task) VALUES (? ,?)",
    [userId, task]
  );

  res.json({ id: insertTodo.insertId, task, completed: 0 });
});

// Update a todo
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const { page } = req.query;

  const [updatedTodo] = await db.execute(
    "UPDATE todos SET completed = ? WHERE id = ?",
    [completed, id]
  );

  res.json({ message: "Todo completed" });
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const [deleteTodo] = await db.execute(
    "DELETE FROM todos WHERE id = ? AND user_id = ?",
    [id, userId]
  );

  res.send({message: 'Todo deleted'})
});

export default router;
