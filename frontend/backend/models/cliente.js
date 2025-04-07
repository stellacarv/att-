const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clienteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, enum: ['cliente', 'vendedor'], required: true }
});

// Middleware para criptografar senha antes de salvar
clienteSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;