import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });

  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

// export const getProfile = async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   res.json({ user });
// };


// ✅ Obtener perfil de usuario
export const getProfile = async (req, res) => {
  res.json({ message: 'Bienvenido a tu perfil', user: req.user });
};
