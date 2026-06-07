const macroBytes = {
  m0: [104, 116, 116, 112, 115, 58, 47, 47],
  m1: [104, 116, 116, 112, 58, 47, 47]
};

const tokens = ["m0", "m1"];

for (let i = 0; i < 256; i++) {
  tokens.push(i.toString(16).padStart(2, "0"));
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const parts = url.pathname.split("/").filter(Boolean);

  if (parts[0] === "~") {
    return materialize(parts.slice(1));
  }

  if (!parts.every(isToken)) {
    return html("invalid token", 400);
  }

  return html(renderTokenPage(parts), 200);
}

function renderTokenPage(state) {
  const prefix = state.length ? `/${state.join("/")}` : "";
  const done = state.length ? `/~/${state.join("/")}/` : "/~/";
  const links = tokens
    .map(token => `<li><a href="${prefix}/${token}/">${escapeHtml(token)}</a></li>`)
    .join("\n");

  return `<nav>
<a href="/">RESET</a>
<a href="${done}">DONE</a>
</nav>
<ul>
${links}
</ul>`;
}

function materialize(state) {
  if (!state.length) {
    return html("missing", 400);
  }

  let decoded;
  try {
    decoded = decodeTokens(state);
  } catch {
    return html("invalid token", 400);
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

function decodeTokens(state) {
  const bytes = [];

  for (const token of state) {
    if (token in macroBytes) {
      bytes.push(...macroBytes[token]);
    } else if (/^[0-9a-f]{2}$/.test(token)) {
      bytes.push(parseInt(token, 16));
    } else {
      throw new Error("invalid token");
    }
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
}

function isToken(token) {
  return token in macroBytes || /^[0-9a-f]{2}$/.test(token);
}

function link(label, href) {
  const safeHref = escapeHtml(href);
  return `<a href="${safeHref}">${escapeHtml(label)}</a>`;
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
