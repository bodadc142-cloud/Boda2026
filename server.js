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
// Endpoint paginado para listar imágenes del folder "boda2026"
app.get("/gallery", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const next_cursor = req.query.next_cursor || undefined;
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: "boda2026/", // coincide con el folder en la subida
      max_results: limit,
      context: true, // importante para obtener el uploader
      direction: -1, // descendente (más nuevas primero)
      next_cursor
    });

    const images = resources.resources.map(r => ({
      url: r.secure_url,
      type: r.resource_type,
      uploader: r.context && r.context.custom && r.context.custom.nombre ? r.context.custom.nombre : "Anónimo",
      created_at: r.created_at
    }));

    res.json({
      images,
      next_cursor: resources.next_cursor || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudieron obtener las imágenes" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
