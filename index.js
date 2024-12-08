const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Rota de teste para verificar grafia
app.get('/check-word', async (req, res) => {
  const { produto } = req.query; // Captura a variável "produto" do Landbot

  if (!produto) {
    return res.status(400).json({ error: 'Parâmetro "produto" é obrigatório' });
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
            content: `A palavra "${produto}" está escrita corretamente?`,
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

    // Extrair a resposta do ChatGPT
    const answer = response.data.choices[0].message.content.trim();

    res.json({
      produto,
      correct: answer,
    });
  } catch (error) {
    console.error('Erro ao acessar a API do ChatGPT:', error.message);
    res.status(500).json({
      error: 'Erro ao verificar a palavra. Tente novamente.',
    });
  }
});

// Rota principal para verificar se o servidor está rodando
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
