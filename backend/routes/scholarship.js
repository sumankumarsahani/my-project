const express = require('express');
const Scholarship = require('../models/Scholarship');
const authMiddleware = require('../middleware/auth'); // For protecting routes

const router = express.Router();

// Create a new scholarship (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can create scholarships' });
  }

  const { title, description, eligibility, deadline, amount } = req.body;

  try {
    const scholarship = new Scholarship({
      title,
      description,
      eligibility,
      deadline,
      amount,
      createdBy: req.user.userId,
    });

    await scholarship.save();
    res.status(201).json(scholarship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all scholarships
router.get('/', async (req, res) => {
  try {
    const scholarships = await Scholarship.find().populate('createdBy', 'name email');
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single scholarship by ID
router.get('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id).populate('createdBy', 'name email');
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a scholarship (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can update scholarships' });
  }

  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a scholarship (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can delete scholarships' });
  }

  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    res.json({ message: 'Scholarship deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
