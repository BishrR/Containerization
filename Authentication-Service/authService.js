const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const loginValidate = [
    check('username', 'Username Must Be an Email Address').isEmail().trim().escape().normalizeEmail(),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password Must Be at Least 8 Characters')
        .matches('[0-9]').withMessage('Password Must Contain a Number')
        .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
        .trim().escape()
];

// Define the specific user credentials
const validUsername = 'user@example.com';
const validPassword = 'Password123';

app.post('/authenticate', (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        const username = req.body.username;
        const password = req.body.password;

        // Simple if-else validation
        if (username === validUsername && password === validPassword) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    }
});

const port = 3002;
app.listen(port, () => console.log(`Authentication service is running on port ${port}`));
