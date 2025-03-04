import mongoose from "mongoose";

const HomeConfigSchema = new mongoose.Schema({
  title: { type: String, required: true, default: "Bienvenido a Render3D" },
  description: { type: String, required: true, default: "Explora impresionantes renderizados 3D de proyectos arquitectónicos." },
  backgroundImage: { type: String, default: "" },
  contactInfo: {
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    socialMedia: [{ name: String, url: String }],
  },
});

const HomeConfig = mongoose.model("HomeConfig", HomeConfigSchema);
export default HomeConfig;
