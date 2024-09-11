const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios'); // Add axios for making HTTP requests
const fs = require('fs');
const mysql = require('mysql2/promise'); // MySQL library to use promises


app.use(bodyParser.urlencoded({ extended: false }));

// MySQL connection details
const dbConfig = {
    host: 'mysql-db',
    user: 'user',
    password: 'password',
    database: 'videosdb'
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
  });

  app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });


    // app.post('/login', (req, res) => {
    //     const username = req.body.username;
    //     const password = req.body.password;
    //     // Send credentials to the authentication service
    //     axios.post('http://auth:3002/authenticate', { username, password })
    //         .then(response => {
    //             console.log('Response from auth service:', response.data); // Log the response

    //             if (response.data.success) {
    //                  // If authenticated, fetch the video list from the file system service
    //             axios.get('http://file-system:3003/list-videos')
    //             .then(fileResponse => {
    //                 // Render a page with the list of videos to stream
    //                 const videos = fileResponse.data.videos;
    //                 let videoListHTML = `<h1>Select a video to stream</h1><ul>`;
    //                 videos.forEach(video => {
    //                     videoListHTML += `<li><a href="/stream/${video}">${video}</a></li>`;
    //                 });
    //                 videoListHTML += `</ul>`;
    //                 res.send(videoListHTML);
    //             })
    //             .catch(err => {
    //                 res.status(500).send('Failed to retrieve video list');
    //             });
    //             } else {
    //                 // If authentication fails, show error message
    //                 res.status(401).send('Invalid username or password');
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error during authentication:', error.message); // Log the error message
    //             console.error('Error details:', error); // Log the entire error object
                
    //             res.status(500).send('Authentication service is unavailable');
    //         });
    // });


    // Handle video streaming


// Handle login and fetch video list from DB
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Send credentials to the authentication service
    try {
        const authResponse = await axios.post('http://auth:3002/authenticate', { username, password });

        if (authResponse.data.success) {
            // If authenticated, fetch the video list from the MySQL DB
            const connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.query('SELECT name FROM videos');
            connection.end();

            // Render a page with the list of videos to stream
            let videoListHTML = `<h1>Select a video to stream</h1><ul>`;
            rows.forEach(video => {
                videoListHTML += `<li><a href="/stream/${video.name}">${video.name}</a></li>`;
            });
            videoListHTML += `</ul>`;
            res.send(videoListHTML);

        } else {
            // If authentication fails, show error message
            res.status(401).send('Invalid username or password');
        }

    } catch (error) {
        console.error('Error during authentication or fetching video list:', error.message);
        res.status(500).send('Authentication service or DB is unavailable');
    }
});






//     app.get('/stream/:filename', (req, res) => {
//     const { filename } = req.params;

//     // Request the video file from the file system service
//     axios({
//         url: `http://file-system:3003/video/${filename}`,
//         method: 'GET',
//         responseType: 'stream'
//     })
//     .then(videoResponse => {
//         // Set the appropriate headers for video streaming
//         res.setHeader('Content-Type', 'video/mp4');
//         videoResponse.data.pipe(res);
//     })
//     .catch(error => {
//         res.status(500).send('Failed to stream the video');
//     });
// });

    
  // Handle video streaming based on the file path from DB
app.get('/stream/:filename', async (req, res) => {
    const { filename } = req.params;
    //console.log("THE FILE NAME ISSSSSSSSSSSSSSSSSSSSSSSS: ", filename);
    try {
        // Fetch the video path from the MySQL DB based on the filename
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT path FROM videos WHERE name = ?', [filename]);
        connection.end();

        if (rows.length > 0) {
            //const videoPath = rows[0].path;
            const videoFilename = filename; // Assuming filename is stored in the DB


           // console.log("THE VIDEO PATH ISSSSSSSSSSSSSSSSSSSSSSSS: ", videoPath);
            // Request the video file from the file system service using the path
            const videoResponse = await axios({
                url: `http://file-system:3003/video/${videoFilename}`, // Assuming path is stored as "/videos/filename.mp4"
                method: 'GET',
                responseType: 'stream'
            });

            // Set the appropriate headers for video streaming
            res.setHeader('Content-Type', 'video/mp4');
            videoResponse.data.pipe(res);

        } else {
            res.status(404).send('Video not found in database');
        }

    } catch (error) {
        console.error('Error fetching video path or streaming the video:', error.message);
        res.status(500).send('Failed to stream the video');
    }
});

    


  

  const port = 3004;
app.listen(port, () => console.log(`Video Streaming service is running on port ${port}`));