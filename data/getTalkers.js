const fs = require('fs').promises;

const FILE_PATH = './talker.json';

const getTalkers = async () => {
  const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
  const talkers = JSON.parse(fileContent);

  return talkers;
};

module.exports = getTalkers;