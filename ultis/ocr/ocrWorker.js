const { Worker } = require('bullmq');
const connection = require("../connection/connection")
const { imageToText } = require('./orc');
const { translateQueue } = require('../translate/translateQueue');



new Worker('ocr', async job => {
  const { filePath, jobId } = job.data;
  const text = await imageToText(filePath);
  await translateQueue.add('translate-job', { text, jobId });
}, {connection});
