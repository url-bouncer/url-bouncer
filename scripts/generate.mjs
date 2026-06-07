import { writeFile } from "node:fs/promises";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const build = Date.now().toString(36);

let body = `<nav>
<a href="/">RESET</a>
<a href="./~/?v=${build}">DONE</a>
</nav>
<ul>
`;

for (const ch of alphabet) {
  body += `<li><a href="./${ch}/?v=${build}">${ch}</a></li>\n`;
}

body += `</ul>
`;

const html = `<!doctype html>
<meta charset="utf-8">
${body}`;

await writeFile("index.html", html);
