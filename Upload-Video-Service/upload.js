const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios'); // Add axios for making HTTP requests

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
  });

  app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });


  app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        // Send credentials to the authentication service
        axios.post('http://auth:3002/authenticate', { username, password })
            .then(response => {
                if (response.data.success) {
                    // If authenticated, redirect to the upload page
                    res.sendFile(path.join(__dirname, 'static', 'upload.html'));
                } else {
                    // If authentication fails, show error message
                    res.status(401).send('Invalid username or password');
                }
            })
            .catch(error => {
                res.status(500).send('Authentication service is unavailable');
            });
    });


const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'temp/' });
const FormData = require('form-data'); // Import FormData from the form-data package

const mysql = require('mysql2/promise'); // For connecting to MySQL
// Database connection settings
const dbConfig = {
    host: 'mysql-db',
    user: 'user',
    password: 'password',
    database: 'videosdb',
};

    
app.post('/upload-video', upload.single('video'), async (req, res) => {
    if (req.file) {
        const videoName = req.file.originalname;

        // Send the video file to the file system service
        const filePath = path.join(__dirname, 'temp', req.file.filename);
        const formData = new FormData();
        formData.append('video', fs.createReadStream(filePath), {
            filename: req.file.originalname,  // Attach the original filename in the metadata
        });

        try {
            // Send the file to the file system service
            const fileSystemResponse = 
            await axios.post('http://file-system:3003/upload-video', 
                formData, { headers: formData.getHeaders(),});

            console.log("THE FORM DATA IS :", formData.getHeaders());
            // File successfully uploaded to file system, remove temp file
            fs.unlinkSync(filePath);

            const videoPath = path.join('/videos', videoName);

            // Store video details in the MySQL database
            const connection = await mysql.createConnection(dbConfig);
            await connection.execute('INSERT INTO videos (name, path) VALUES (?, ?)', 
                [videoName, videoPath]);
            await connection.end();

            res.send('Video uploaded successfully, and details stored in MySQL database!');
        } catch (error) {
            console.error('Error uploading to file system or storing in DB:', error.message);
            res.status(500).send('Failed to upload video or store in database');
        }
    } else {
        res.status(400).send('No file uploaded');
    }
});


const port = 3001;
app.listen(port, () => console.log(`This app is listening on port ${port}`));