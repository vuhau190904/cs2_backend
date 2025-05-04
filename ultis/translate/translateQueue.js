const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = require("../connection/connection")

const translateQueue = new Queue('translate', { connection });

module.exports = { translateQueue };
