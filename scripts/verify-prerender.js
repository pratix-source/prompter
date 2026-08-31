const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, 'dist', 'en', 'prompt-generator', 'index.html');
const html = fs.readFileSync(pagePath, 'utf8');
const required = [
  '<title>Prompt Generator Pro – Free AI Prompt Generator | Pratix.io</title>',
  '<meta name="description" content="Create professional AI prompts for Midjourney, DALL-E, Stable Diffusion, Sora, Runway, ChatGPT, Claude and Gemini in your browser." />',
  '<link rel="canonical" href="https://pratix.io/en/prompt-generator" />',
  'hreflang="en"',
  'hreflang="x-default"',
  'id="prerendered-seo-content"',
  'textarea',
  'localStorage',
  'copy',
];
const missing = required.filter(marker => !html.includes(marker));
if (missing.length) throw new Error(`Missing markers: ${missing.join(', ')}`);
if ((html.match(/data-prerender-hreflang="true"/g) || []).length !== 2) {
  throw new Error('Expected exactly 2 pilot hreflang links');
}
console.log('Static head and client-side prompt editor markers: passed');
