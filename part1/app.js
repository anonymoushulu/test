var express = require('express');
var app = express();

app.on('hello-alert', function() {
    console.log('warning!')
})

app.get('/', function(req, res) {
    res.app.emit('hello-alert');
    res.send('hello world')
})

app.listen(3000)