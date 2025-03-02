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

    if (user.needsUpdate) {
      return res.status(200).json({
        message: "Debes completar tu información.",
        needsUpdate: true,
        token,
        user: { _id: user._id, role: user.role }
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });

  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

// ✅ Crear usuario
export const createUser = async (req, res) => {
  try {
    const { email, name, role } = req.body;  // 🔹 Ahora recibe email y name
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permisos para crear usuarios." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Este usuario ya existe." });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = new User({
      name,  // 🔹 Se guarda el nombre
      email, // 🔹 Se guarda el email
      password: hashedPassword,
      role,
      needsUpdate: true,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario creado", tempPassword });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

// ✅ Obtener perfil de usuario
export const getProfile = async (req, res) => {
  res.json({ message: 'Bienvenido a tu perfil', user: req.user });
};

// ✅ Actualizar perfil de usuario
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ message: "Este correo ya está en uso" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, { name, email, needsUpdate: false }, { new: true });

    res.json({ message: "Perfil actualizado", user });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando perfil", error: error.message });
  }
};

// ✅ Obtener clientes
export const getClients = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permisos para ver los clientes." });
    }

    const clients = await User.find({ role: "cliente" }).select("_id name email");
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo clientes", error: error.message });
  }
};
