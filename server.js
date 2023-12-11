const express = require('express');
const path = require('path');

const app = express();

//CONSTANTS
let serverPort = 8080;


app.get('/documentation', (req, res) => {
    const filePath = path.join(process.cwd(), 'public/documentation.html');
    res.sendFile(filePath);
});

app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(serverPort, () => {
    console.log(`Server started on port ${serverPort}`);
});