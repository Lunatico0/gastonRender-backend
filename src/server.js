import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import './config/db.js';
import projectRoutes from './routes/project.routes.js';
import authRoutes from './routes/auth.routes.js';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const comparePassword = () => {
  const hashedPassword = "$2b$10$Zm9nawtSpRU5KgfBFfx3/ehdCw.fPiHd7izfCn/4iypK4I.PXSpbe"; // Reemplaza con la que copiaste
  const tempPassword = "3zb7w1as"; // La que generaste al crear el usuario

  bcrypt.compare(tempPassword, hashedPassword, (err, res) => {
    console.log("¿Las contraseñas coinciden?", res);
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
