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
app.use(cors({
  origin: ["https://dmcrms.in", "http://localhost:5173", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false        // change to true if using cookies/auth
}));
// Middleware
app.use(express.json());


// Routes
app.use('/api/v1', clientRouter);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
