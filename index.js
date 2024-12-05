const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); // Para requisições HTTP
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECT_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Aplicação Node.js noo Render funcionando!');
});

// Rota para verificar grafia
app.get('/check-word', async (req, res) => {
  const { word } = req.query;

  if (!word) {
    return res.status(400).json({ error: 'Parâmetro "word" é obrigatório' });
  }

  try {
    // Requisição para a API do ChatGPT
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Escolha o modelo apropriado
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente de verificação de ortografia.',
          },
          {
            role: 'user',
            content: `A palavra "${word}" está escrita corretamente?`,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Chave da API do OpenAI
        },
      }
    );

    const answer = response.data.choices[0].message.content.trim();

    res.json({ word, correct: answer });
  } catch (error) {
    console.error('Erro ao acessar a API do ChatGPT:', error.message);
    res.status(500).json({ error: 'Erro ao verificar a palavra. Tente novamente.' });
  }
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
