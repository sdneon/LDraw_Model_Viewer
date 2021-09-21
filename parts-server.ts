/// <reference path="../typings/references.ts" />
/// <reference path="./file-fetcher.ts" />

// to set up node and apache to run on the same server: http://stackoverflow.com/a/18604082/1063392

//load colors module
(function(){function b(d,e,g){function a(j,i){if(!e[j]){if(!d[j]){var f="function"==typeof require&&require;if(!i&&f)return f(j,!0);if(h)return h(j,!0);var c=new Error("Cannot find module '"+j+"'");throw c.code="MODULE_NOT_FOUND",c}var k=e[j]={exports:{}};d[j][0].call(k.exports,function(b){var c=d[j][1][b];return a(c||b)},k,k.exports,b,d,e,g)}return e[j].exports}for(var h="function"==typeof require&&require,c=0;c<g.length;c++)a(g[c]);return a}return b})()({1:[function(a){a("colors").setTheme({silly:"rainbow",input:"grey",verbose:"cyan",prompt:"grey",info:"green",data:"grey",help:"cyan",warn:"yellow",debug:"blue",error:"red"})},{colors:6}],2:[function(a,b){function c(a){var b=function a(){return d.apply(a,arguments)};return b._styles=a,b.__proto__=l,b}function d(){var b=arguments,c=b.length,d=0!==c&&arguments[0]+"";if(1<c)for(var e=1;e<c;e++)d+=" "+b[e];if(!f.enabled||!d)return d;for(var h,j=this._styles,k=j.length;k--;)h=g[j[k]],d=h.open+d.replace(h.closeRe,h.open)+h.close;return d}function e(a){for(var b in a)(function(b){f[b]=function(c){if("object"==typeof a[b]){var d=c;for(var e in a[b])d=f[a[b][e]](d);return d}return f[a[b]](c)}})(b)}var f={};b.exports=f,f.themes={};var g=f.styles=a("./styles"),h=Object.defineProperties;f.supportsColor=a("./system/supports-colors"),"undefined"==typeof f.enabled&&(f.enabled=f.supportsColor),f.stripColors=f.strip=function(a){return(""+a).replace(/\x1B\[\d+m/g,"")};var i=f.stylize=function(a,b){return f.enabled?g[b].open+a+g[b].close:a+""},j=function(a){if("string"!=typeof a)throw new TypeError("Expected a string");return a.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&")},k=function(){var a={};return g.grey=g.gray,Object.keys(g).forEach(function(b){g[b].closeRe=new RegExp(j(g[b].close),"g"),a[b]={get:function(){return c(this._styles.concat(b))}}}),a}(),l=h(function(){},k);f.setTheme=function(b){if("string"==typeof b)try{return f.themes[b]=a(b),e(f.themes[b]),f.themes[b]}catch(a){return console.log(a),a}else e(b)};var m=function(a,b){var c=b.split("");return c=c.map(a),c.join("")};for(var n in f.trap=a("./custom/trap"),f.zalgo=a("./custom/zalgo"),f.maps={},f.maps.america=a("./maps/america"),f.maps.zebra=a("./maps/zebra"),f.maps.rainbow=a("./maps/rainbow"),f.maps.random=a("./maps/random"),f.maps)(function(a){f[a]=function(b){return m(f.maps[a],b)}})(n);h(f,function(){var a={};return Object.keys(k).forEach(function(b){a[b]={get:function(){return c([b])}}}),a}())},{"./custom/trap":3,"./custom/zalgo":4,"./maps/america":7,"./maps/rainbow":8,"./maps/random":9,"./maps/zebra":10,"./styles":11,"./system/supports-colors":12}],3:[function(a,b){var d=Math.floor;b.exports=function(a){var b="";a=a||"Run the trap, drop the bass",a=a.split("");var e={a:["@","\u0104","\u023A","\u0245","\u0394","\u039B","\u0414"],b:["\xDF","\u0181","\u0243","\u026E","\u03B2","\u0E3F"],c:["\xA9","\u023B","\u03FE"],d:["\xD0","\u018A","\u0500","\u0501","\u0502","\u0503"],e:["\xCB","\u0115","\u018E","\u0258","\u03A3","\u03BE","\u04BC","\u0A6C"],f:["\u04FA"],g:["\u0262"],h:["\u0126","\u0195","\u04A2","\u04BA","\u04C7","\u050A"],i:["\u0F0F"],j:["\u0134"],k:["\u0138","\u04A0","\u04C3","\u051E"],l:["\u0139"],m:["\u028D","\u04CD","\u04CE","\u0520","\u0521","\u0D69"],n:["\xD1","\u014B","\u019D","\u0376","\u03A0","\u048A"],o:["\xD8","\xF5","\xF8","\u01FE","\u0298","\u047A","\u05DD","\u06DD","\u0E4F"],p:["\u01F7","\u048E"],q:["\u09CD"],r:["\xAE","\u01A6","\u0210","\u024C","\u0280","\u042F"],s:["\xA7","\u03DE","\u03DF","\u03E8"],t:["\u0141","\u0166","\u0373"],u:["\u01B1","\u054D"],v:["\u05D8"],w:["\u0428","\u0460","\u047C","\u0D70"],x:["\u04B2","\u04FE","\u04FC","\u04FD"],y:["\xA5","\u04B0","\u04CB"],z:["\u01B5","\u0240"]};return a.forEach(function(a){a=a.toLowerCase();var f=e[a]||[" "],g=d(Math.random()*f.length);b+="undefined"==typeof e[a]?a:e[a][g]}),b}},{}],4:[function(a,b){b.exports=function(a,b){function c(a){var b=Math.floor(Math.random()*a);return b}function e(a){var b=!1;return h.filter(function(c){b=c===a}),b}function f(a,b){var f,h,j="";for(h in b=b||{},b.up="undefined"==typeof b.up||b.up,b.mid="undefined"==typeof b.mid||b.mid,b.down="undefined"==typeof b.down||b.down,b.size="undefined"==typeof b.size?"maxi":b.size,a=a.split(""),a)if(!e(h)){switch(j+=a[h],f={up:0,down:0,mid:0},b.size){case"mini":f.up=c(8),f.mid=c(2),f.down=c(8);break;case"maxi":f.up=c(16)+3,f.mid=c(4)+1,f.down=c(64)+3;break;default:f.up=c(8)+1,f.mid=c(6)/2,f.down=c(8)+1;}var k=["up","mid","down"];for(var m in k)for(var d=k[m],n=0;n<=f[d];n++)b[d]&&(j+=g[d][c(g[d].length)])}return j}a=a||"   he is here   ";var g={up:["\u030D","\u030E","\u0304","\u0305","\u033F","\u0311","\u0306","\u0310","\u0352","\u0357","\u0351","\u0307","\u0308","\u030A","\u0342","\u0313","\u0308","\u034A","\u034B","\u034C","\u0303","\u0302","\u030C","\u0350","\u0300","\u0301","\u030B","\u030F","\u0312","\u0313","\u0314","\u033D","\u0309","\u0363","\u0364","\u0365","\u0366","\u0367","\u0368","\u0369","\u036A","\u036B","\u036C","\u036D","\u036E","\u036F","\u033E","\u035B","\u0346","\u031A"],down:["\u0316","\u0317","\u0318","\u0319","\u031C","\u031D","\u031E","\u031F","\u0320","\u0324","\u0325","\u0326","\u0329","\u032A","\u032B","\u032C","\u032D","\u032E","\u032F","\u0330","\u0331","\u0332","\u0333","\u0339","\u033A","\u033B","\u033C","\u0345","\u0347","\u0348","\u0349","\u034D","\u034E","\u0353","\u0354","\u0355","\u0356","\u0359","\u035A","\u0323"],mid:["\u0315","\u031B","\u0300","\u0301","\u0358","\u0321","\u0322","\u0327","\u0328","\u0334","\u0335","\u0336","\u035C","\u035D","\u035E","\u035F","\u0360","\u0362","\u0338","\u0337","\u0361"," \u0489"]},h=[].concat(g.up,g.down,g.mid),i={};return f(a,b)}},{}],5:[function(a,b){var c=a("./colors");b.exports=function(){function b(a){var b=["__defineGetter__","__defineSetter__","__lookupGetter__","__lookupSetter__","charAt","constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf","charCodeAt","indexOf","lastIndexof","length","localeCompare","match","replace","search","slice","split","substring","toLocaleLowerCase","toLocaleUpperCase","toLowerCase","toUpperCase","trim","trimLeft","trimRight"];Object.keys(a).forEach(function(e){-1===b.indexOf(e)?"string"==typeof a[e]?(c[e]=c[a[e]],d(e,function(){return c[a[e]](this)})):d(e,function(){for(var b=this,d=0;d<a[e].length;d++)b=c[a[e][d]](b);return b}):console.log("warn: ".red+("String.prototype"+e).magenta+" is probably something you don't want to override. Ignoring style name")})}var d=function(a,b){String.prototype.__defineGetter__(a,b)};d("strip",function(){return c.strip(this)}),d("stripColors",function(){return c.strip(this)}),d("trap",function(){return c.trap(this)}),d("zalgo",function(){return c.zalgo(this)}),d("zebra",function(){return c.zebra(this)}),d("rainbow",function(){return c.rainbow(this)}),d("random",function(){return c.random(this)}),d("america",function(){return c.america(this)});var e=Object.keys(c.styles);e.forEach(function(a){d(a,function(){return c.stylize(this,a)})}),c.setTheme=function(d){if("string"==typeof d)try{return c.themes[d]=a(d),b(c.themes[d]),c.themes[d]}catch(a){return console.log(a),a}else b(d)}}},{"./colors":2}],6:[function(a,b){var c=a("./colors");b.exports=c,a("./extendStringPrototype")()},{"./colors":2,"./extendStringPrototype":5}],7:[function(a,b){var c=a("../colors");b.exports=function(){return function(a,b){if(" "===a)return a;switch(b%3){case 0:return c.red(a);case 1:return c.white(a);case 2:return c.blue(a);}}}()},{"../colors":2}],8:[function(a,b){var c=a("../colors");b.exports=function(){var a=["red","yellow","green","blue","magenta"];return function(b,d){return" "===b?b:c[a[d++%a.length]](b)}}()},{"../colors":2}],9:[function(a,b){var c=a("../colors");b.exports=function(){var a=["underline","inverse","grey","yellow","red","green","blue","white","cyan","magenta"];return function(b){return" "===b?b:c[a[Math.round(Math.random()*(a.length-1))]](b)}}()},{"../colors":2}],10:[function(a,b){var c=a("../colors");b.exports=function(a,b){return 0==b%2?a:c.inverse(a)}},{"../colors":2}],11:[function(a,b){var c={};b.exports=c;var d={reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],inverse:[7,27],hidden:[8,28],strikethrough:[9,29],black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],gray:[90,39],grey:[90,39],bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49],blackBG:[40,49],redBG:[41,49],greenBG:[42,49],yellowBG:[43,49],blueBG:[44,49],magentaBG:[45,49],cyanBG:[46,49],whiteBG:[47,49]};Object.keys(d).forEach(function(a){var b=d[a],e=c[a]=[];e.open="\x1B["+b[0]+"m",e.close="\x1B["+b[1]+"m"})},{}],12:[function(a,b){var c=process.argv;b.exports=function(){return-1===c.indexOf("--no-color")&&-1===c.indexOf("--color=false")&&(!(-1===c.indexOf("--color")&&-1===c.indexOf("--color=true")&&-1===c.indexOf("--color=always"))||(!process.stdout||process.stdout.isTTY)&&(!("win32"!==process.platform)||!!("COLORTERM"in process.env)||"dumb"!==process.env.TERM&&!!/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)))}()},{}]},{},[1]);

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