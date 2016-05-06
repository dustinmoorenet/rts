const express = require('express');

const app = express();
app.use('/', express.static(`${__dirname}/../dist/`));

const server = app.listen(8078, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('RTS listening at http://%s:%s', host, port);
});
