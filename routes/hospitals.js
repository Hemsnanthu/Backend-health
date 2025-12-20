const express = require('express');
const router = express.Router();
const Hospital = require('../../client/src/components/admin/health/hospitalApi.tsx');

// GET all hospitals
router.get('/', async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});

// POST new hospital
router.post('/', async (req, res) => {
  const { name, district, beds, contact } = req.body;
  const hospital = new Hospital({ name, district, beds, contact });
  await hospital.save();
  res.status(201).json(hospital);
});

// PUT update hospital
router.put('/:id', async (req, res) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(hospital);
});

// DELETE hospital
router.delete('/:id', async (req, res) => {
  await Hospital.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
