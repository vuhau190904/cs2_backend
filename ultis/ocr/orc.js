const tesseract = require("node-tesseract-ocr");
const fs = require('fs');

async function imageToText(path) {
    try {
        const result = await tesseract.recognize(path, { lang: "eng" });
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        return result;
    } catch (error) {
        console.error("OCR Error:", error);
        return null;
    }
}

module.exports = { imageToText };
