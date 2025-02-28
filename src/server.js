import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import './config/db.js';
import projectRoutes from './routes/project.routes.js';
// import authRoutes from './routes/auth.routes.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/projects', projectRoutes);
// app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
