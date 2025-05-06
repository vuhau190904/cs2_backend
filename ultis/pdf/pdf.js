const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function createPDF(text, jobId) {
    const outputDir = path.join(__dirname, "../..", "output");
    const outFile = path.join(outputDir, `${jobId}.pdf`);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(outFile));
    doc.font('font/Roboto-Regular.ttf')
        .fontSize(14)
        .text(text, 100, 100);
    doc.end();

}

module.exports = { createPDF };
