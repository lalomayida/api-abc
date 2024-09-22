const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose
  .connect("mongodb://localhost:27017/api-abc", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("No se pudo conectar a MongoDB", err));

// Definir un modelo
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("Item", ItemSchema);

// Rutas

// Crear un nuevo item
app.post("/items", async (req, res) => {
  console.log(req.body);
  const item = new Item(req.body);

  try {
    console.log("creating item");
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Leer un item
app.get("/items/:id", async (req, res) => {
  try {
    console.log("getting item");
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leer todos los items
app.get("/items", async (req, res) => {
  try {
    console.log("getting items");
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Editar un item
app.put("/items/:id", async (req, res) => {
  try {
    console.log("updating item");
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) return res.status(404).send("Item no encontrado");
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un item
app.delete("/items/:id", async (req, res) => {
  try {
    console.log("deleting item");
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).send("Item no encontrado");
    res.json({ message: "Item eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
