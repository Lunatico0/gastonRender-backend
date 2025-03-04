import HomeConfig from "../models/homeConfig.model.js";

// ✅ Obtener la configuración actual del Home
export const getHomeConfig = async (req, res) => {
  try {
    const config = await HomeConfig.findOne() || new HomeConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo la configuración", error: error.message });
  }
};

// ✅ Actualizar la configuración (Solo Admin)
export const updateHomeConfig = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permisos para modificar el Home." });
    }

    const config = await HomeConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ message: "Configuración actualizada", config });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando la configuración", error: error.message });
  }
};
