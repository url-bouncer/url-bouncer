import { writeFile } from "node:fs/promises";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

let body = `<nav>
<a href="/">RESET</a>
<a href="./~/">DONE</a>
</nav>
<ul>
`;

for (const ch of alphabet) {
  body += `<li><a href="./${ch}/">${ch}</a></li>\n`;
}

body += `</ul>
`;

const html = `<!doctype html>
<meta charset="utf-8">
${body}`;

await writeFile("index.html", html);
