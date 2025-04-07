const mongoose = require("mongoose");

const estoqueSchema = new mongoose.Schema({
  item: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
});

const Estoque = mongoose.model("Estoque", estoqueSchema);

module.exports = Estoque;
