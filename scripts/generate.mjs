import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const links = ['<a href="/c/">RESET</a>', '<a href="~/">DONE</a>'];

for (const a of alphabet) {
  links.push(`<a href="${a}/">${a}</a>`);
}

for (const a of alphabet) {
  for (const b of alphabet) {
    links.push(`<a href="${a}${b}/">${a}${b}</a>`);
  }
}

const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title></title>
${links.join('\n')}
`;

const root = dirname(dirname(fileURLToPath(import.meta.url)));
writeFileSync(join(root, '404.html'), html);
