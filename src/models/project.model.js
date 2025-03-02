import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["nueva_construccion", "remodelacion_completa", "espacio_especifico"],
    required: true
  },
  images: [
    {
      public_id: String,
      url: String
    }
  ],
  videos: [
    {
      type: String
    }
  ],
  status: {
    type: String,
    enum: ["publico", "privado"],
    default: "publico"
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
