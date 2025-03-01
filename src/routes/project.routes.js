import { Router } from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';

const router = Router();

router.post('/', protect, createProject); // Solo usuarios autenticados pueden crear proyectos
router.get('/', getAllProjects); // Todos pueden ver los proyectos públicos
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject); // Solo usuarios autenticados pueden editar proyectos
router.delete('/:id', protect, deleteProject); // Solo usuarios autenticados pueden eliminar proyectos

export default router;
