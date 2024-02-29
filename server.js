import * as http from "node:http";
import * as fs from "node:fs";
let filesArray = fs.readdirSync("public/images/asset");
let forTransfer = JSON.stringify(filesArray);
function responseActions(responseObject, fileData, isIndex, isSvg) {
    responseObject.statusCode = 200;
    if(isSvg) {
        responseObject.setHeader("Content-Type", "image/svg+xml");
    }
    responseObject.write(fileData);
    if(isIndex) {
        responseObject.end(forTransfer);
    }
    else {
        responseObject.end();
    }
}
const server = http.createServer(function (request, response) {
    if(request.url === "/") {
        response.statusCode = 301;
        response.setHeader("Location", "/public/index.html");
        response.end();
    }
    else if(request.url.startsWith("/public")) {
        if(request.url.endsWith("index.html")) {
            fs.readFile(request.url, function (error, data) {
                responseActions(response, data, true, false);
            });
        }
        else if(request.url.endsWith("svg")) {
            fs.readFile(request.url, function (error, data) {
                responseActions(response, data, false, true);
            });
        }
        else {
            fs.readFile(request.url, function (error, data) {
                responseActions(response, data, false, false);
            });
        }
    }
});
server.listen(8080, "127.0.0.1", function () {
    console.log("Server started at 8080");
});