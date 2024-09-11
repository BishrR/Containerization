const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const app = express();
const port = 3004;

app.use(express.json());

const storagePath = '/data/videos';

app.post('/save', async (req, res) => {
    const { videoData } = req.body;

    // Create unique filename
    const videoPath = path.join(storagePath, `video_${Date.now()}.mp4`);

    try {
        await fs.outputFile(videoPath, videoData);
        res.status(200).send({ path: videoPath });
    } catch (error) {
        res.status(500).send('Error saving video');
    }
});

app.listen(port, () => {
    console.log(`File System Service running on port ${port}`);
});
