import express from 'express';
import "dotenv/config"
import authRoutes from './routes/authRoutes.js';
import booksRoutes from './routes/booksRoute.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});


app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});