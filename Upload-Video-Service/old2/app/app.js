const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/login', async (req, res) => {
    const { user } = req.body;

    // Validate with Authentication Service
    try {
        //const authResponse = await axios.post('http://authentication-service:3002/login', { user.data.username, user.data.password });
        if (authResponse.data.valid) {
            res.status(200).json({ valid: true });
        } else {
            res.status(401).json({ valid: false });
        }
    } catch (error) {
        res.status(500).send('Authentication Service error');
    }
});

app.post('/upload', async (req, res) => {
    const video = req.body.video;  // Expecting the video file data

    // Upload video to File System Service
    try {
        const fileSystemResponse = await axios.post('http://file-system-service:3004/save', { videoData: video });
        const videoPath = fileSystemResponse.data.path;

        // Save video metadata to MySQL DB Service
        await axios.post('http://mysql-db-service:3003/save-metadata', { videoPath });

        res.status(200).send('Video uploaded successfully');
    } catch (error) {
        res.status(500).send('Error uploading video');
    }
});

app.listen(port, () => {
    console.log(`Upload Video Service running on port ${port}`);
});
