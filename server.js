const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());

app.use(serveStatic(path.join(__dirname, 'build')));


var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Example app listening at port %s', port);
});