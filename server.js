const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());

// Configuración Cloudinary
cloudinary.config({
  cloud_name: "de3zy3vvo",
  api_key: "278539932414348",
  api_secret: "lYcxBPLNc7IkAqvHwiVSBNRqqKc"
});

// Endpoint para listar imágenes del folder
app.get("/gallery", async (req, res) => {
  try {
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: "boda_2026/",
      max_results: 500,
      context: true
    });

    const images = resources.resources.map(r => ({
      url: r.secure_url,
      type: r.resource_type,
      uploader: r.context && r.context.uploader ? r.context.uploader.custom : "Anónimo"
    }));

    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudieron obtener las imágenes" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
