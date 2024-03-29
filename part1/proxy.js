var http = require('http');
var url = require('url');

http.createServer((req, res) => {
    console.log('start request:', req.url);
    var options = url.parse(req.url);
    options.headers = req.headers;
    var proxyRequest = http.request(options, (proxyResponse) => {
        proxyResponse.on('data', (chunk) => {
            console.log('proxyResponse length:', chunk.length);
            res.write(chunk, 'binary');
        });

        proxyResponse.on('end', () => {
            console.log('proxied request end');
            res.end();
        })

        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    });

    req.on('data', (chunk) => {
        console.log('in request length:', chunk.length);
        proxyRequest.write(chunk, 'binary')
    });

    req.on('end', () => {
        console.log('original request ended');
        proxyRequest.end();
    });
}).listen(8080);