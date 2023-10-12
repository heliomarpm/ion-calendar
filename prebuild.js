const fs = require('fs');

console.log("%c:: UPDATING VERSION", "color: #007acc;");

let pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf-8').toString());
let version = pkgJson.version.split(".");
const lastIndex = version.length - 1;

version[lastIndex] = parseInt(version[lastIndex]) + 1;
// trata o formato: 1 -> 2.0.0 | 1.1 -> 1.2.0 | 1.1.1 -> 1.1.2
pkgJson.version = version.join(".") + (lastIndex <= 1 ? ".0".repeat(3 - (lastIndex + 1)) : "");
fs.writeFileSync('package.json', JSON.stringify(pkgJson, null, "\t"), 'utf-8');
console.log("... UPDATE PACKAGE.JSON"); 

let env = fs.readFileSync('src/environments/app.settings.ts', 'utf-8');
env = env.replace(/version: '.*'/, `version: '${pkgJson.version}'`);
fs.writeFileSync('src/environments/app.settings.ts', env, 'utf-8');
console.log("... UPDATE APP.SETTINGS.TS");

let xml = fs.readFileSync('config.xml', 'utf-8');
xml = xml.replace(/id="br.codeuapp.contadordedias" version=".*"/, `id="br.codeuapp.contadordedias" version="${pkgJson.version}" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0"`);
fs.writeFileSync('config.xml', xml, 'utf-8');  
console.log("... UPDATE CONFIG.XML");
 
console.log("%c:: NEW VERSION ->", "color: #007acc;", pkgJson.version);
