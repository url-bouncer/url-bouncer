export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const parts = url.pathname
    .split("/")
    .filter(Boolean)
    .slice(1);

  const encoded = parts.join("");

  if (!encoded) {
    return html("missing", 400);
  }

  let decoded;
  try {
    decoded = decodeBase64Url(encoded);
  } catch {
    return html("invalid base64url", 400);
  }

  let target;
  try {
    target = new URL(decoded);
  } catch {
    return html("invalid url", 400);
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return html("invalid scheme", 400);
  }

  const encodedTarget = encodeURIComponent(target.href);
  const readerTarget = target.href.replace(/^https?:\/\//, "");
  const probes = [
    ["direct", target.href],
    ["microlink metadata", `https://api.microlink.io/?url=${encodedTarget}&meta=true`],
    ["microlink markdown", `https://api.microlink.io/?url=${encodedTarget}&markdown=true&meta=false`],
    ["microlink screenshot", `https://api.microlink.io/?url=${encodedTarget}&screenshot=true&meta=false`],
    ["microlink pdf", `https://api.microlink.io/?url=${encodedTarget}&pdf=true&meta=false`],
    ["jina reader", `https://r.jina.ai/http://${readerTarget}`],
    ["allorigins get", `https://api.allorigins.win/get?url=${encodedTarget}`],
    ["allorigins raw", `https://api.allorigins.win/raw?url=${encodedTarget}`]
  ];
  const items = probes.map(([label, href]) => `<li>${link(label, href)}</li>`).join("\n");

  return html(`<p>${escapeHtml(target.href)}</p>
<ul>
${items}
</ul>`, 200);
}

function link(label, href) {
  const safeHref = escapeHtml(href);
  return `<a href="${safeHref}">${escapeHtml(label)}</a>`;
}

function decodeBase64Url(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";

  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);

  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }

  return new TextDecoder().decode(bytes);
}

function html(body, status = 200) {
  return new Response(`<!doctype html><meta charset="utf-8">${body}`, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}
