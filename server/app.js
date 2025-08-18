const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/connectDB.js');
const webRoutes = require('./routes/web.js');

// Socket.IO and http imports have been removed as they are no longer needed.

dotenv.config();
const app = express();

// The separate http server and Socket.IO initialization have been removed.

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
app.use(express.json());

// The Socket.IO connection handler (io.on(...)) has been removed.

// 🔥 Route ALL requests to web.js
app.use('/api/auth', webRoutes);
app.use('/api', webRoutes);
app.use('/api/blogs', webRoutes); // Specific route for blogs
app.use('/atl', webRoutes);
app.use('/btl', webRoutes);
app.use('/ttl', webRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // --- Use the standard app.listen ---
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});