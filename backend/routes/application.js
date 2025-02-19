const express = require('express');
const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply for a scholarship (Student only)
router.post('/apply', authMiddleware, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can apply for scholarships' });
  }

  const { scholarshipId } = req.body;

  try {
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }

    const application = new Application({
      student: req.user.userId,
      scholarship: scholarshipId,
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all applications for a student
router.get('/my-applications', authMiddleware, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can view their applications' });
  }

  try {
    const applications = await Application.find({ student: req.user.userId }).populate('scholarship');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all applications for a scholarship (Admin only)
router.get('/scholarship/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view applications for a scholarship' });
  }

  try {
    const applications = await Application.find({ scholarship: req.params.id }).populate('student', 'name email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve/Reject an application (Admin only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can update application status' });
  }

  const { status } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;