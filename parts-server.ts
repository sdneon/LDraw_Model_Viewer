/// <reference path="../typings/references.ts" />
/// <reference path="./file-fetcher.ts" />

// to set up node and apache to run on the same server: http://stackoverflow.com/a/18604082/1063392

const PREFIX_PLAIN_TEXT_B64 = `data:text/plain;base64,`;

function btoa_utf8(input)
{
    return Buffer.from(input, 'utf8').toString('base64');
}

const fileFetcher = require('./file-fetcher');

function spawnServer()
{
    const express = require('express'),
    bodyParser = require('body-parser'),
    domain = require('domain'),
    app = express();
    app.use(bodyParser.urlencoded({ extended: false, limit: 1048576 }));
    app.use(express.static('public_ldr'));

    app.post('/ldr_query', (req, res) => {
    console.log('/ldr_query'.bold.debug);
    var d = domain.create();
    var responseHasBeenSent = false;
    d.on('error', function(er) {
        if (!responseHasBeenSent) {
            responseHasBeenSent = true;
            console.log(er);
            res.status(500).send(er);
        }
    });
    d.run(function() {
        const start = Date.now();
        fileFetcher.fetchFiles(JSON.parse(req.body.parts)[0], (allFiles: string[]) => {
            console.log('request took ' + (Date.now() - start) + ' ms to complete');
            const data = {};
            Object.keys(allFiles).forEach((key) => {
                data[key] = PREFIX_PLAIN_TEXT_B64 + btoa_utf8(allFiles[key]);
            });
            res.status(200).send(JSON.stringify(data));
        });
    });
    });

    var server = app.listen(80);
}

if (process.argv.length < 3)
{
    spawnServer();
}
else
{
    //commandline data generation mode
    const fs = require('fs'),
        inputFilename = process.argv[2];
    const start = Date.now();
    fs.readFile(inputFilename, { flag: 'r', encoding: 'utf8' }, (err, data) => {
        if (err)
        {
            console.log(`ERR: Failed to get ${inputFilename}`, err);
            return;
        }
        const outputFilename = `${inputFilename}.model.txt`;
        fs.writeFile(outputFilename, btoa_utf8(data), {flag: 'w+', encoding:'utf8'}, (err) => {
            if (err)
            {
                console.log(`ERR: Failed write model file: ${outputFilename}`, err);
                return;
            }
            console.log(`OK: Wrote model file: ${outputFilename}`);
        });
        fileFetcher.fetchFiles(data, (allFiles: string[]) => {
            console.log('request took ' + (Date.now() - start) + ' ms to complete');
            let data = {};
            Object.keys(allFiles).forEach((key) => {
                const line = allFiles[key];
                if (line.length > 0)
                {
                    data[key] = PREFIX_PLAIN_TEXT_B64 + btoa_utf8(line);
                }
            });
            data = JSON.stringify(data);
            const outRespFilename = `${inputFilename}.resp.txt`;
            fs.writeFile(outRespFilename, data, {flag: 'w+', encoding:'utf8'}, (err) => {
                if (err)
                {
                    console.log(`ERR: Failed to write all-parts response file: ${outRespFilename}`, err);
                    return;
                }
                console.log(`OK: Wrote all-parts response file: ${outRespFilename}`);
            });
        });
    });
}