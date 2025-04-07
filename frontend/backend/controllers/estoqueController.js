const Estoque = require("../models/estoque");

// Criar novo estoque
exports.createEstoque = async (req, res) => {
  try {
    const { item, name, description, brand } = req.body;
    const estoque = new Estoque({ item, name, description, brand });
    await estoque.save();
    res.status(201).json(estoque);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar o estoque
exports.getEstoque = async (req, res) => {
  try {
    const estoque = await Estoque.find().populate("brand", "name");
    res.status(200).json(estoque);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getEstoqueById = async (req, res) => {
  try {
    const estoque = await Estoque.findById(req.params.id).populate(
      "brand",
      "name"
    );
    if (!estoque) {
      return res.status(404).json({ message: "Nenhum item encontrado" });
    }
    res.status(200).json(estoque);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Adicionar ao estoque
exports.updateEstoque = async (req, res) => {
  try {
    const { id } = req.params;
    const { item, name, brand, description } = req.body;

    const updatedEstoque = await Estoque.findByIdAndUpdate(
      id,
      { item, name, brand, description },
      { new: true }
    );
    if (!updatedEstoque)
      return res.status(404).json({ message: "Produto não encontrada" });

    res.status(200).json(updatedEstoque);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Excluir do estoque
exports.deleteEstoque = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedestoque = await Estoque.findByIdAndDelete(id);
    if (!deletedestoque)
      return res.status(404).json({ message: "Produto não encontrado" });

    res.status(200).json({ message: "Produto excluída!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
