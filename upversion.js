import { readFileSync, writeFileSync } from "node:fs";

console.log("%c:: UPDATING VERSION", "color: #007acc;");

let pkgJson = JSON.parse(readFileSync("package.json", "utf-8").toString());
const version = pkgJson.version.split(".");
const lastIndex = version.length - 1;

version[lastIndex] = Number.parseInt(version[lastIndex]) + 1;

// trata o formato: 1 -> 2.0.0 | 1.1 -> 1.2.0 | 1.1.1 -> 1.1.2
const newVersion =
	version.join(".") + (lastIndex <= 1 ? ".0".repeat(3 - (lastIndex + 1)) : "");

pkgJson.version = newVersion;
writeFileSync("package.json", JSON.stringify(pkgJson, null, "\t"), "utf-8");
console.log("... UPDATE PACKAGE.JSON");

pkgJson = JSON.parse(
	readFileSync("projects/ion-calendar/package.json", "utf-8").toString(),
);
pkgJson.version = newVersion;
writeFileSync(
	"projects/ion-calendar/package.json",
	JSON.stringify(pkgJson, null, "\t"),
	"utf-8",
);
console.log("... UPDATE ION-CALENDAR PACKAGE.JSON");

console.log("%c:: NEW VERSION ->", "color: #007acc;", pkgJson.version);
