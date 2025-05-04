const fs = require('fs/promises');
const crypto = require('crypto');

function hashBuffer(buffer) {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

async function hashFile(filePath) {
  const buffer = await fs.readFile(filePath);
  return hashBuffer(buffer);
}

module.exports = {hashFile}