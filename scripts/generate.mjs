import { writeFile } from "node:fs/promises";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

let links = '<a href="/c/">RESET</a> <a href="~/">DONE</a>';

for (const a of alphabet) {
  links += ` <a href="${a}/">${a}</a>`;
}

for (const a of alphabet) {
  for (const b of alphabet) {
    const t = a + b;
    links += ` <a href="${t}/">${t}</a>`;
  }
}

await writeFile("404.html", `<!doctype html>
<meta charset="utf-8">
<title></title>
${links}
`);
