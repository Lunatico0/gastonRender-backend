import { Router } from 'express';
import upload from '../middlewares/upload.middleware.js';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';

const router = Router();

router.post('/', upload.array('images', 10), createProject); // Acepta hasta 10 imágenes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
