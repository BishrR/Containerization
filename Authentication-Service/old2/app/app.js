const express = require('express');
const app = express();
const port = 3002;

app.use(express.json()); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For x-www-form-urlencoded bodies

// Single user data for validation
const validUsername = 'user';
const validPassword = 'pass';

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === validUsername && password === validPassword) {
        res.status(200).send({ message: 'Login successful' });
    } else {
        res.status(401).send({ error: 'Invalid username or password' });
    }
});

app.listen(port, () => {
    console.log(`Authentication Service running on port ${port}`);
});
