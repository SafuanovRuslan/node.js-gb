import http from 'http';
import fs from 'fs';
import path from 'path';
import commonjsVariables from 'commonjs-variables-for-esmodules';
 
const { __dirname } = commonjsVariables(import.meta); // type: module, почему-то в таком режиме нет __dirname
const server = http;
const root = __dirname;


server.createServer((req, res) => {

    let fullPath = decodeURI(path.join(root, req.url));
    let list;

    function getParentDirectory() {
        return path.resolve(fullPath, '../') == root ? '/' : path.resolve(fullPath, '../').slice(root.length);
    }

    function updateList() {
        if ( !fs.lstatSync(fullPath).isFile() ) {
            list = fs.readdirSync(fullPath);
        }
    }

    if ( fs.existsSync(fullPath) ) {

        updateList();

        if ( fs.lstatSync(fullPath).isDirectory() ) {
            let page = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Document</title>
                        </head>
                        <body>
                            <h1>Wellcome to the file system</h1>
                            <a href="${getParentDirectory()}">../</a><br>`;
    
            list.forEach(element => {
                page += `<a href="${path.resolve(fullPath, element).slice(root.length)}">${element}</a><br>`;
            });

            page += `</body>
                     </html>`
    
            res.end(page);
        } else if ( fs.lstatSync(fullPath).isFile() ) {
            let page = fs.readFileSync(fullPath);
            res.end(page);
        }

    } else {
        console.log('No such file');
        res.writeHead(404, 'No such file', {});
        res.end();
    }

    
    
}).listen(3000);