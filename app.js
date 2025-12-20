console.log("🔥 REAL APP.JS IS RUNNING");

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Prevent caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ✅ Auth Routes
app.use('/api', authRoutes);

// ✅ Doctor Routes
app.use('/api/doctors', doctorRoutes);

// =================== DEMO DATA ===================
let staffMembers = [
  { id: '1', name: 'Dr. K. RAJA', staffType: 'Doctor' },
  { id: '2', name: 'Dr. ANUSHA KUMARI', staffType: 'Doctor' },
  { id: '3', name: 'Dr. R. SOMASUNDARA PANDIAN', staffType: 'Nurse' }
];

let attendanceRecords = [
  {
    id: '1',
    staffId: '1',
    staffName: 'Dr. K. RAJA',
    staffType: 'Doctor',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00',
    checkOut: '17:00'
  }
];

// ✅ STAFF ROUTES
app.get('/staff', (req, res) => {
  res.json(staffMembers);
});

// ✅ ATTENDANCE ROUTES
app.get('/attendance', (req, res) => {
  res.json(attendanceRecords);
});

app.post('/attendance', (req, res) => {
  const newRecord = {
    id: Date.now().toString(),
    ...req.body
  };

  attendanceRecords.push(newRecord);
  res.status(201).json(newRecord);
});

app.put('/attendance/:id', (req, res) => {
  const { id } = req.params;
  const index = attendanceRecords.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Record not found" });
  }

  attendanceRecords[index] = { ...attendanceRecords[index], ...req.body };
  res.json(attendanceRecords[index]);
});

app.delete('/attendance/:id', (req, res) => {
  const { id } = req.params;
  const index = attendanceRecords.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Record not found" });
  }

  attendanceRecords.splice(index, 1);
  res.json({ message: "Record deleted" });
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

