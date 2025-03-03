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
    const { title, description, category, videos, status, clientId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Se requiere al menos una imagen." });
    }

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
      status,
      client: status === "privado" ? clientId : null,
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
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find(); // 🔹 Admins ven todos los proyectos
    } else {
      projects = await Project.find({ status: "publico" }); // 🔹 Usuarios normales solo ven públicos
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los proyectos", error: error.message });
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

// ✅ Obtener proyectos privados de un cliente
export const getPrivateProjects = async (req, res) => {
  try {
    console.log("🔍 req.user en getPrivateProjects:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const userId = req.user._id;
    console.log("🔍 Buscando proyectos para el usuario:", userId);

    const projects = await Project.find({ status: "privado", client: userId });

    console.log("✅ Proyectos privados encontrados:", projects);

    if (!projects.length) {
      return res.status(404).json({ message: "No tienes proyectos privados asignados." });
    }

    res.json(projects);
  } catch (error) {
    console.error("❌ Error en getPrivateProjects:", error.message);
    res.status(500).json({ message: "Error al obtener los proyectos privados", error: error.message });
  }
};
