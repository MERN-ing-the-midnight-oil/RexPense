// server/routes/categories.ts
import express from 'express';
import pool from '../db';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST a new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// PUT rename a category
// PUT /api/categories/rename
router.put('/rename', async (req, res) => {
  const { oldName, newName } = req.body;
  console.log('🔄 Rename request:', { oldName, newName });

  if (!oldName || !newName) {
    return res.status(400).json({ error: 'Both oldName and newName are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE name = $2 RETURNING *',
      [newName, oldName]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error renaming category:', error);
    res.status(500).json({ error: 'Failed to rename category' });
  }
});


// DELETE category and reassign expenses
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('🗑️ Delete category request for ID:', id);

  try {
    // Step 1: Find 'Uncategorized' fallback category
    const uncategorized = await pool.query(
      'SELECT id FROM categories WHERE name = $1',
      ['Uncategorized']
    );
    console.log('🔍 Uncategorized lookup result:', uncategorized.rows);

    if (uncategorized.rows.length === 0) {
      console.error('🚫 Uncategorized category not found');
      return res.status(500).json({ error: 'Uncategorized category not found' });
    }

    const fallbackId = uncategorized.rows[0].id;
    console.log('✅ Fallback category ID:', fallbackId);

    // Step 2: Reassign expenses
    const updateResult = await pool.query(
    'UPDATE expenses SET category_id = $1 WHERE category_id = $2',
      [fallbackId, id]
    );
    console.log('🔁 Reassigned expenses result:', updateResult.rowCount);

    // Step 3: Delete the category
    const deleteResult = await pool.query(
      'DELETE FROM categories WHERE id = $1',
      [id]
    );
    console.log('🗑️ Delete category result:', deleteResult.rowCount);

    res.json({ message: 'Category deleted and expenses reassigned' });
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});


export default router;
