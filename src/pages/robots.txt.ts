import type { APIRoute } from 'astro';
import { asset } from '../lib/paths';

const bots = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Applebot-Extended',
  'Google-Extended',
  '*',
];

export const GET: APIRoute = ({ site }) => {
  const sitemapLine = site ? `\n\nSitemap: ${new URL(asset('sitemap.xml'), site).href}` : '';
  const body = `${bots.map((agent) => `User-agent: ${agent}\nAllow: /`).join('\n\n')}${sitemapLine}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
