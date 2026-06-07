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

  const summaryFunction = `({ page }) => page.evaluate(() => ({
  href: location.href,
  title: document.title,
  text: document.body?.innerText?.slice(0, 20000) || "",
  htmlLen: document.documentElement.outerHTML.length,
  scriptCount: document.scripts.length,
  scripts: Array.from(document.scripts).slice(0, 10).map(s => ({
    src: s.src,
    text: s.textContent.slice(0, 500)
  })),
  links: Array.from(document.links).slice(0, 100).map(a => ({
    text: a.innerText.slice(0, 120),
    href: a.href
  }))
}))`;
  const probes = [
    ["direct target", target.href],
    ["microlink title", microlink(target, "({ page }) => page.title()")],
    ["microlink readable text", microlink(target, "({ page }) => page.evaluate(() => document.body?.innerText?.slice(0, 20000) || \"\")")],
    ["microlink compact DOM/script summary", microlink(target, summaryFunction)],
    ["microlink outerHTML prefix", microlink(target, "({ page }) => page.evaluate(() => document.documentElement.outerHTML.slice(0, 20000))")]
  ];
  const items = probes.map(([label, href]) => `<li>${link(label, href)}</li>`).join("\n");

  return html(`<ul>
${items}
</ul>`, 200);
}

function link(label, href) {
  const safeHref = escapeHtml(href);
  return `<a href="${safeHref}">${escapeHtml(label)}</a>`;
}

function microlink(target, fn) {
  const url = new URL("https://api.microlink.io/");
  url.searchParams.set("url", target.href);
  url.searchParams.set("function", fn);
  url.searchParams.set("meta", "false");
  return url.href;
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
