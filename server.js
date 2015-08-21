var express = require('express');
var service = require('./service')

var app = express();

app.get('/data', service.findAll);


app.listen(3000);
console.log('Listening on port 3000...');
