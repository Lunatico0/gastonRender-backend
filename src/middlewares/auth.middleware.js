import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // Excluir contraseña
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  } else {
    res.status(401).json({ message: 'No autorizado, falta token' });
  }
};

export default protect;
