const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const response = await axios.post('http://auth-service:3000/authenticate', { username, password });
        if (response.data.authenticated) {
            res.redirect('/upload');
        } else {
            res.send('Login failed');
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.send('Login failed');
    }
});

// Serve upload form if authenticated
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Handle video upload
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No video uploaded.');
    }
    res.send('Video uploaded successfully.');
});

app.listen(port, () => {
    console.log(`Upload Video Service listening on port ${port}`);
});
