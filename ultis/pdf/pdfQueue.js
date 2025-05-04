const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = require("../connection/connection")

const pdfQueue = new Queue('pdf', { connection });

module.exports = { pdfQueue };
