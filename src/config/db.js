import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); // ¡Sin opciones innecesarias!
    console.log('🔥 Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

export default mongoose;
