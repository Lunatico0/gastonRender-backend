import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';

// ✅ Registrar un usuario
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id) // 🔐 Generar JWT
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

// ✅ Iniciar sesión
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id) // 🔐 Generar JWT
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

// ✅ Obtener perfil de usuario
export const getProfile = async (req, res) => {
  res.json({ message: 'Bienvenido a tu perfil', user: req.user });
};
