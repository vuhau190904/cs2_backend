const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const outputDir = __dirname;


// Maximum file age to keep (10 minutes = 10 * 60 * 1000 ms)
const maxFileAge = 10 * 60 * 1000;

function deleteOldFiles() {
    fs.readdir(outputDir, (err, files) => {
        if (err) return console.error('Error when reading files:', err);

        const now = Date.now();

        files.forEach(file => {
            if (file === 'cleanOutput.js') return;

            const filePath = path.join(outputDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return console.error('Error getting file information:', err);

                const fileAge = now - stats.mtimeMs;
                if (fileAge > maxFileAge) {
                    fs.unlink(filePath, err => {
                        if (!err) {
                            console.log(`Removed outdated file: ${file}`);
                        } else {
                            console.error(`Error deleting file ${file}:`, err);
                        }
                    });
                }
            });
        });
    });
}

cron.schedule('*/10 * * * *', () => {
    console.log('Running cleanup: removing outdated files...');
    deleteOldFiles();
});
