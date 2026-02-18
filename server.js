const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');
const userDataRoutes = require("./routes/userDataRoutes");
const PreferencRoutes = require("./routes/preferenceRoutes");
const callRequestRoutes = require("./routes/callRequestRoutes");
const dateRequestRoutes = require("./routes/dateRequestRoutes");
const likeRoutes = require("./routes/likeRoutes");
const interviewerRoutes = require("./routes/interviewerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const interviewerAvailibilityRoutes = require("./routes/interviewerAvailibiltyRoutes");
const callRoutes = require("./routes/call.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const visitsRoutes = require("./routes/visitRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

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

app.use("/api/callRequest", callRequestRoutes);
app.use("/api/dateRequest", dateRequestRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/interviewer", interviewerRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/interviewer-availability", interviewerAvailibilityRoutes)
app.use('/api/call', callRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/feedback",feedbackRoutes);
app.use("/api/visits", visitsRoutes);
// Use routes
app.use("/api/interview", interviewRoutes);




app.use('/api/quiz', require('./routes/quiz.routes'));
app.use('/api/notifications', notificationRoutes);



// Start Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
