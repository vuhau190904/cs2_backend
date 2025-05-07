const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const connection = require("./ultis/connection/connection")
const { ocrQueue } = require("./ultis/ocr/ocrQueue")
const { hashFile } = require("./ultis/hash/hashBuffer")
const path = require('path');
const fs = require('fs');
const Redis = require("ioredis");
const { QueueEvents } = require('bullmq');
const rateLimit = require('express-rate-limit');



const app = express();
const redis = new Redis();

const pdfEvents = new QueueEvents('pdf', { connection });


const port = 4000;

const uploadDir = path.join(__dirname, 'upload');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 1000,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

app.use(limiter);
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        const id = uuidv4();
        const ext = path.extname(file.originalname);
        req.fileId = id;
        cb(null, id + ext);
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), async (req, res) => {
    const filePath = req.file.path;
    const id = req.fileId;

    const hash = await hashFile(filePath);
    const cached = await redis.get(`ocr:${hash}`);
    if (cached) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        const pdfPath = path.join(__dirname, 'output', `${cached}.pdf`);
        res.download(pdfPath, `${id}.pdf`);
    } else {
        await ocrQueue.add('ocr-job', { filePath, jobId: id });
        pdfEvents.on('completed', async ({ returnvalue }) => {
            const returnedJobId = returnvalue?.jobId;
            if (returnedJobId === id) {
                const pdfPath = path.join(__dirname, 'output', `${id}.pdf`);
                res.download(pdfPath, `${id}.pdf`);
                await redis.set(`ocr:${hash}`, id, 'EX', 600);
            }
        });

    }
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
