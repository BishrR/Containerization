const users = {
    user1: 'password1',
    user2: 'password2'
};

function authenticate(username, password) {
    return users[username] && users[username] === password;
}

module.exports = { authenticate };
