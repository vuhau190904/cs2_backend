const { Queue } = require('bullmq');

const connection = require("../connection/connection")

const ocrQueue = new Queue('ocr', { connection });

module.exports = { ocrQueue };
