const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const videosDir = path.join(__dirname, 'videos');
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videosDir); // Store in 'videos' directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save with the original file name
    }
});
const upload = multer({ storage: storage });

app.post('/upload-video', upload.single('video'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully!');
    } else {
        res.status(400).send('No file uploaded');
    }
});

   app.get('/list-videos', (req, res) => {
    fs.readdir(videosDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to list videos');
        }
        res.json({ videos: files });
    });
});

    app.get('/video/:filename', (req, res) => {
        const videoPath = path.join(videosDir, req.params.filename);   
           
        // Check if the file exists
        if (fs.existsSync(videoPath)) {
            res.sendFile(videoPath);
        } else {
            res.status(404).send('File not found');
        }
    });

const port = 3003;
app.listen(port, () => console.log(`File System service is running on port ${port}`));
