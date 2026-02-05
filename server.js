require('dotenv').config(); 


const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const userDataRoutes = require("./routes/userDataRoutes");
const PreferencRoutes = require("./routes/preferenceRoutes")



// Initialize app`
const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WingMan API is running 🚀'
  })
})


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


app.use('/api/auth', require('./routes/auth.routes'));
app.use("/api/userData", userDataRoutes);
app.use("/api/preference",PreferencRoutes);





// Start Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
