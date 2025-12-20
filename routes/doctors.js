const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET /add-doctor — Get all doctors
router.get('/add-doctor', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving doctors', error: error.message });
  }
});

// POST /add-doctor — Add a doctor
router.post('/add-doctor', async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    res.status(500).json({ message: 'Error adding doctor', error: error.message });
  }
});

module.exports = router;
