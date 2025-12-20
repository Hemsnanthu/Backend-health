const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  contact: String,
  availableDays: [String],
  availableTime: String,
  image: String,
});

const Doctor = mongoose.model('doctor', doctorSchema);
module.exports = Doctor;
