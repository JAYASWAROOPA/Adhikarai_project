const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const autoFillRoutes = require('./routes/autoFillRoutes');
const documentRoutes = require('./routes/documentRoutes');
const officeRoutes = require('./routes/officeRoutes');
const assistantRoutes = require('./routes/assistantRoutes');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/application', autoFillRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/offices', officeRoutes);
app.use('/api/assistant', assistantRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'ADHIKARAI Backend API is active with Real-Bot AI Assistant, Office Locator & Auto-Fill Engine' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ADHIKARAI Node API Server is running on port ${PORT}`);
});
