const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dist = path.join(root, 'dist');
const origin = 'https://pratix.io';
const route = '/en/prompt-generator';
const metadata = {
  locale: 'en',
  title: 'Prompt Generator Pro – Free AI Prompt Generator | Pratix.io',
  description: 'Create professional AI prompts for Midjourney, DALL-E, Stable Diffusion, Sora, Runway, ChatGPT, Claude and Gemini in your browser.',
};

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function decodeTemplate(wrapper) {
  const match = wrapper.match(/atob\("([A-Za-z0-9+/=]+)"\)/);
  if (!match) throw new Error('Encoded HTML template was not found');
  return Buffer.from(match[1], 'base64').toString('utf8');
}

function replaceOrInsertTag(html, pattern, replacement) {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace('</head>', `${replacement}\n</head>`);
}

function renderStaticPage() {
  let html = decodeTemplate(source).replaceAll('https://yourdomain.com', origin);
  html = replaceOrInsertTag(html, /<html\s+lang="[^"]*"[^>]*>/, `<html lang="${metadata.locale}" dir="ltr" data-theme="light">`);
  html = replaceOrInsertTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`);
  html = replaceOrInsertTag(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(metadata.description)}" />`);
  html = replaceOrInsertTag(html, /<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${origin}${route}" />`);
  html = replaceOrInsertTag(html, /<meta\s+property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`);
  html = replaceOrInsertTag(html, /<meta\s+property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`);
  html = replaceOrInsertTag(html, /<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${origin}${route}" />`);
  html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>/g, '');
  html = html.replace('</head>', [
    `  <meta name="twitter:card" content="summary" />`,
    `  <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
    `  <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
    `  <link rel="alternate" hreflang="en" href="${origin}${route}" data-prerender-hreflang="true" />`,
    `  <link rel="alternate" hreflang="x-default" href="${origin}${route}" data-prerender-hreflang="true" />`,
    '</head>',
  ].join('\n'));
  html = html.replace('<body>', `<body>\n  <section id="prerendered-seo-content" aria-label="${escapeHtml(metadata.title)}">\n    <h1>${escapeHtml(metadata.title)}</h1>\n    <p>${escapeHtml(metadata.description)}</p>\n  </section>`);
  return html;
}

const rendered = renderStaticPage();
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'en', 'prompt-generator'), { recursive: true });
fs.writeFileSync(path.join(dist, 'index.html'), rendered);
fs.writeFileSync(path.join(dist, 'en', 'prompt-generator', 'index.html'), rendered);
console.log('Prerendered 2 English pages into dist/');
