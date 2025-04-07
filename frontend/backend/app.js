const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const clienteRoutes = require('./routes/clienteRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parse de JSON
app.use(express.json());

app.use(cors());

// Conectando ao MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabasenew', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB!');
}).catch(err => {
    console.log('Erro ao conectar ao MongoDB:', err);
});

// Usando rotas
app.use('/api/clientes', clienteRoutes);
app.use('/api/estoque', estoqueRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});