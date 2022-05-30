const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const xhr = new XMLHttpRequest();

function register(username, password, callback) {
    xhr.open("POST", "http://52.69.52.35:8000/api/register/", true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ username: username, password: password }));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText)
        }
    }
}

module.exports = register;