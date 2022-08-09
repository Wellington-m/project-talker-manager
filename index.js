const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const fileContent = await fs.readFile('./talker.json', 'utf-8');
  const talkers = JSON.parse(fileContent);
  
  if (!talkers) return res.status(200).json([]);

  res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const fileContent = await fs.readFile('./talker.json', 'utf-8');
  const talkers = JSON.parse(fileContent);

  const { id } = req.params;

  const selectedTalker = talkers.find((talker) => talker.id === Number(id));

  if (!selectedTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  res.status(200).json(selectedTalker);
});

app.post('/login', (req, res) => {
  const TOKEN_LENGTH = 16;

  const generateRandomToken = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i += 1) {
      token += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return token;
  };

  const randomToken = generateRandomToken(TOKEN_LENGTH);
  
  res.status(200).json({ token: `${randomToken}` });
});

app.listen(PORT, () => {
  console.log('Online');
});
