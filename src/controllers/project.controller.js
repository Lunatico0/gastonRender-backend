import Project from '../models/project.model.js';
import cloudinary from '../config/cloudinary.js';

const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'projects' },
      (error, result) => {
        if (error) reject(error);
        else resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );
    uploadStream.end(file.buffer);
  });
};

// ✅ Crear un nuevo proyecto con imágenes
export const createProject = async (req, res) => {
  try {
    const { title, description, category, videos, status } = req.body;

    // Subir imágenes a Cloudinary usando Promesas
    const uploadedImages = await Promise.all(
      req.files.map(file => uploadImageToCloudinary(file))
    );

    const newProject = new Project({
      title,
      description,
      category,
      images: uploadedImages,
      videos,
      status
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
  }
};
// ✅ Obtener todos los proyectos
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los proyectos', error: error.message });
  }
};

// ✅ Obtener un solo proyecto por ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proyecto', error: error.message });
  }
};

// ✅ Actualizar un proyecto por ID
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) return res.status(404).json({ message: 'Proyecto no encontrado' });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el proyecto', error: error.message });
  }
};

// ✅ Eliminar un proyecto por ID
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: 'Proyecto no encontrado' });

    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
  }
};
