const express = require('express');
const rendertron = require('rendertron-middleware');

const app = express();

app.use(
    rendertron.makeMiddleware({
      proxyUrl: 'http://me:3090',
    })
);

app.use(express.static('files'));
app.listen(8080);