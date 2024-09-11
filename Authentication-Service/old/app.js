const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/authenticate', (req, res) => {
    const { username, password } = req.body;
    const authenticated = auth.authenticate(username, password);
    res.json({ authenticated });
});

app.listen(port, () => {
    console.log(`Authentication service listening on port ${port}`);
});
