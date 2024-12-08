const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Conexão com o MongoDB (opcional para o teste)
mongoose
  .connect(process.env.MONGODB_CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota de teste básica
app.get('/test', (req, res) => {
  const { testParam } = req.query;

  if (!testParam) {
    return res.status(400).json({ error: 'Parâmetro "testParam" é obrigatório' });
  }

  res.json({ message: `Recebido: ${testParam}` });
});

// Rota principal para verificar se o servidor está rodando
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
