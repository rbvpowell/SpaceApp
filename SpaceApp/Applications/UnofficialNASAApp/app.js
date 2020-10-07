const http = require('http');
const fs = require("fs");
const port = 3124;

const server = http.createServer(function (request, response) {    
    request.on('error', err => {
        console.error(err);
        // Handle error...
        response.statusCode = 400;
        response.end('400: Bad Request');
        return;
    });

    response.on('error', err => {
        console.error(err);
        // Handle error...
    });

    var page = request.url;
    if(request.url == "/"){
        response.writeHead(302, {
            'Location': 'Views/Index'
          });

        response.end();
    } else{
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(page)[1]; 
        var mimeType = "text/html";
        if(ext == null) {
            page += ".html";
            ext = "html";
        }

        if(ext == "css") {
            mimeType = "text/css";
        }
    
        fs.readFile("./" + page, (err, data) => {
            if (err) {
                response.statusCode = 404;
                response.end('404: File Not Found');            
            } else {
                response.writeHead(200, {'Content-Type': mimeType});
                response.write(data);
                response.end();
            }
        });
    }
});

server.listen(port, function(error) {
    if(error) {
        console.log("An error occurred", error)
    } else{
        console.log("Server is listening on port " + port);
    }
});