const { Worker } = require('bullmq');
const { createPDF } = require('./pdf.js');
const connection = require("../connection/connection")


new Worker('pdf', async job => {
  const { text, jobId } = job.data;
  await createPDF(text, jobId);
  return {jobId};
}, {connection});
