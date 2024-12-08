const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json()); // Middleware para tratar JSON

// Função para verificar a grafia da palavra com a API da OpenAI
async function verificarGrafia(palavra) {
  try {
    const prompt = `Verifique se a palavra '${palavra}' está grafada corretamente. Caso contrário, forneça a correção.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',  // ou o modelo que você preferir
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const textoResposta = response.data.choices[0].message.content.trim();

    // Verificando se a palavra está correta
    if (textoResposta.toLowerCase().includes('errada') || textoResposta.toLowerCase().includes('não está correta')) {
      return { message: `A palavra '${palavra}' está incorreta.` };
    } else {
      return { message: `A palavra '${palavra}' está correta.` };
    }
  } catch (error) {
    console.error('Erro ao verificar grafia:', error);
    return { message: 'Erro ao verificar a palavra.' };
  }
}

// Rota do Express para verificar a grafia de uma palavra
app.post('/verificar', async (req, res) => {
  const { palavra } = req.body; // Recebe a palavra da requisição
  if (!palavra) {
    return res.status(400).json({ message: 'Por favor, forneça uma palavra para verificação.' });
  }

  try {
    const resultado = await verificarGrafia(palavra);
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao processar a verificação.' });
  }
});

// Iniciar o servidor Express
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
