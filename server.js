require('dotenv').config(); //added


const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');


// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


app.use('/api/auth', require('./routes/auth.routes'));




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
