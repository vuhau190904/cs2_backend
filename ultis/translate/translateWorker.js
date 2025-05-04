const { Worker } = require('bullmq');
const connection = require("../connection/connection")
const { translate } = require('./translate.js');
const { pdfQueue } = require('../pdf/pdfQueue');

new Worker('translate', async job => {
  const { text, jobId } = job.data;
  const translated = await translate(text);
  await pdfQueue.add('pdf-job', { text: translated, jobId });
}, {connection});
