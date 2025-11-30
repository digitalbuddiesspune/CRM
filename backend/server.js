import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import clientRouter from './routes/ClinetLeadRoute.js';
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
// Middleware
app.use(express.json());


// Routes
app.use('/api/v1', clientRouter);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
