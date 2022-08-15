const Joi = require('joi').extend(require('@joi/date'));

const schemaTalker = Joi.object({ 
  authorization: Joi.string().min(16).required().messages({
    'any.required': 'Token não encontrado',
    'string.empty': 'Token não encontrado',
    'string.min': 'Token inválido',
  }),
  name: Joi.string().min(3).required().messages({
    'any.required': 'O campo "name" é obrigatório',
    'string.empty': 'O campo "name" é obrigatório',
    'string.min': 'O "name" deve ter pelo menos 3 caracteres',
  }),
  age: Joi.number().strict().min(18).required()
  .messages({
    'any.required': 'O campo "age" é obrigatório',
    'number.empty': 'O campo "age" é obrigatório',
    'number.min': 'A pessoa palestrante deve ser maior de idade',
  }),
  talk: Joi.object().keys({
    watchedAt: Joi.date().required().format('DD/MM/YYYY').messages({
      'any.required': 'O campo "watchedAt" é obrigatório',
      'date.empty': 'O campo "watchedAt" é obrigatório',
      'date.format': 'O campo "watchedAt" é obrigatório',
    }),
    rate: Joi.number().strict().min(1).max(5)
    .required()
    .messages({
      'any.required': 'O campo "rate" é obrigatório',
    }),
  }).required().messages({
    'any.required': 'O campo "talk" é obrigatório',
    'number.min': 'O campo "rate" deve ser um inteiro de 1 à 5',
    'number.max': 'O campo "rate" deve ser um inteiro de 1 à 5',
  }),
});

const generateRandomToken = (num) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i += 1) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return token;
};

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const talkerValidation = (req, res, next) => {
  const { authorization } = req.headers;
  const { name, age, talk } = req.body;
  const informations = { authorization, name, age, talk };

  const { error } = schemaTalker.validate(informations);

  const stausCode = () => {
    if (error.details[0].path[0] === 'authorization') {
      return 401;
    }
    return 400;
  };

  if (error) return res.status(stausCode()).json({ message: error.details[0].message });

  next();
};

module.exports = {
  generateRandomToken,
  validateEmail,
  talkerValidation,
};