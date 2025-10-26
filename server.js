const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());

// Configuración Cloudinary
cloudinary.config({
  cloud_name: "de3zy3vvo",
  api_key: "278539932414348",
  api_secret: "lYcxBPLNc7IkAqvHwiVSBNRqqKc"
});

// Endpoint para listar imágenes del folder "boda2026"
app.get("/gallery", async (req, res) => {
  try {
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: "boda2026/", // coincide con el folder en la subida
      max_results: 500,
      context: true // importante para obtener el uploader
    });

    // Ordenar por fecha de subida descendente (las más nuevas primero)
    const sorted = resources.resources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const images = sorted.map(r => ({
      url: r.secure_url,
      type: r.resource_type,
      uploader: r.context && r.context.custom && r.context.custom.nombre ? r.context.custom.nombre : "Anónimo"
    }));

    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudieron obtener las imágenes" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
