import { Router } from 'express';
import protect from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';

const router = Router();

router.post('/', protect, upload.array("images", 5), createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
