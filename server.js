const { MongoClient } = require('mongodb');
const mongoUri = 'mongodb+srv://bodadc142_db_user:Kkr9WHqE2tpn9yq7@cluster0.hh4eo6t.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'boda2026';
const collectionName = 'gallery';
let dbClient;

async function getDb() {
  if (!dbClient) {
    dbClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await dbClient.connect();
  }
  return dbClient.db(dbName);
}
const fs = require('fs');
const path = require('path');
// Endpoint para subir imagen y guardar uploader
app.post('/upload', async (req, res) => {
  try {
    const { uploader, image } = req.body;
    if (!uploader || !image) return res.status(400).json({ error: 'Faltan datos' });

    // Subir imagen a Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: 'boda2026',
    });

    // Guardar en MongoDB
    const db = await getDb();
    await db.collection(collectionName).insertOne({ url: uploadRes.secure_url, uploader });

    res.json({ url: uploadRes.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo subir la imagen' });
  }
});
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
    const db = await getDb();
    const gallery = await db.collection(collectionName).find({}).toArray();
    res.json(gallery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudieron obtener las imágenes" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
