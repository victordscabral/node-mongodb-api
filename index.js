const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Rota para verificar grafia
app.get('/check-word', async (req, res) => {
  const { produto } = req.query; // Captura a variável "produtoo"

  if (!produto) {
    return res.status(400).json({ error: 'Parâmetro "produto" é obrigatório' });
  }

  try {
    // Requisição à API do OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Substitua pelo modelo correto caso necessário
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente de verificação de ortografia.',
          },
          {
            role: 'user',
            content: `A palavra "${produto}" está escrita corretamente?`,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Certifique-se de usar a chave do ambiente
        },
      }
    );

    const answer = response.data.choices[0].message.content.trim();

    res.json({
      produto,
      correct: answer,
    });
  } catch (error) {
    console.error('Erro ao acessar a API do ChatGPT:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erro ao verificar a palavra. Verifique sua chave de API ou o formato da requisição.',
    });
  }
});

// Rota de teste para garantir que o servidor está rodando
app.get('/', (req, res) => {
  res.send('Servidor está funcionando e pronto para receber requisições!');
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
