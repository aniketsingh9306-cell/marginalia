require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: in development this allows any origin. For production, set
// FRONTEND_URL in your .env (e.g. https://your-site.netlify.app) to
// restrict the API to your deployed frontend only.
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : {}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Marginalia API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Marginalia backend running on http://localhost:${PORT}`);
  });
});
