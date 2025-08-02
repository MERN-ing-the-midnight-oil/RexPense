// server/routes/expenses.ts
import express from 'express';
import pool from '../db';

const router = express.Router();

// POST a new expense
router.post('/', async (req, res) => {
  const { amount, category_id, note } = req.body;

  if (!amount || !category_id) {
    return res.status(400).json({ error: 'Amount and category_id are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO expenses (amount, category_id, note)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [amount, category_id, note]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error inserting expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
},

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT expenses.*, categories.name AS category_name
      FROM expenses
      LEFT JOIN categories ON expenses.category_id = categories.id
      ORDER BY created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    console.error('❌ Failed to fetch expenses:', error)
    res.status(500).json({ error: 'Failed to fetch expenses' })
  }
})

);

export default router;
