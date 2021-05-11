const express = require('express');
const rendertron = require('rendertron-middleware');

const app = express();

app.use(
    rendertron.makeMiddleware({
      proxyUrl: 'http://localhost:3090',
    })
);

app.use(express.static('files'));

// app.get('*', async (req, res) => {
//
// });

app.listen(3000, () => console.log(`Server is listening on port: 3000`))