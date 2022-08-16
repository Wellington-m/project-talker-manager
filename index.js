const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const validations = require('./validations/index');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const FILE_PATH = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
  const talkers = JSON.parse(fileContent);
  
  if (!talkers) return res.status(200).json([]);

  res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
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
  const EMAIL_NULL_MESSAGE = 'O campo "email" é obrigatório';
  const INVALID_EMAIL_MESSAGE = 'O "email" deve ter o formato "email@email.com"';
  const PASSWORD_NULL_MESSAGE = 'O campo "password" é obrigatório';
  const PASSWORD_LENGTH_MESSAGE = 'O "password" deve ter pelo menos 6 caracteres';

  const { email, password } = req.body;

  const randomToken = validations.generateRandomToken(TOKEN_LENGTH);

  if (!email) return res.status(400).json({ message: EMAIL_NULL_MESSAGE });
  if (!validations.validateEmail(email)) {
    return res.status(400).json({ message: INVALID_EMAIL_MESSAGE });
  }
  if (!password) return res.status(400).json({ message: PASSWORD_NULL_MESSAGE });
  if (password.length < 6) return res.status(400).json({ message: PASSWORD_LENGTH_MESSAGE });
  
  res.status(200).json({ token: `${randomToken}` });
});

app.use(validations.tokenValidation);

app.delete('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
  const talkers = JSON.parse(fileContent); 
  const newTalkers = talkers.filter((talker) => talker.id !== Number(id));
  await fs.writeFile('talker.json', JSON.stringify(newTalkers));
  res.status(204).json({});
});

app.use(validations.talkerValidation);

app.post('/talker', async (req, res) => {
  const { name, age, talk } = req.body;
  const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
  const talkers = JSON.parse(fileContent); 

  const informations = { id: talkers.length + 1, name, age, talk };
  talkers.push(informations);
  await fs.writeFile(FILE_PATH, JSON.stringify(talkers));
  res.status(201).json({ ...informations });
});

app.put('/talker/:id', async (req, res) => {
  const { name, age, talk } = req.body;
  const { id } = req.params;
  const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
  const talkers = JSON.parse(fileContent); 

  const newTalkers = talkers.reduce((acc, curr, index) => {
    if (curr.id === Number(id)) {
      acc[index] = { id: curr.id, name, age, talk };
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  await fs.writeFile(FILE_PATH, JSON.stringify(newTalkers));
  res.status(200).json({ id: Number(id), name, age, talk });
});

app.listen(PORT, () => {
  console.log('Online');
});
