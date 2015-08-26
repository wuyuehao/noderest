var express = require('express');
var service = require('./service')
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 8080));

app.get('/data', service.findAll);

app.post('/data', service.create);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


