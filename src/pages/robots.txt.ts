import type { APIRoute } from 'astro';
import { asset } from '../lib/paths';

const bots = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'Applebot-Extended',
  'Google-Extended',
  'DuckAssistBot',
  'MistralAI-User',
  'Meta-ExternalAgent',
  '*',
];

export const GET: APIRoute = ({ site }) => {
  const sitemapLine = site ? `\n\nSitemap: ${new URL(asset('sitemap.xml'), site).href}` : '';
  const llmComments = site
    ? `\n# LLMs: ${new URL(asset('llms.txt'), site).href}\n# LLMs Full: ${new URL(asset('llms-full.txt'), site).href}`
    : '';
  const body = `${bots.map((agent) => `User-agent: ${agent}\nAllow: /`).join('\n\n')}${sitemapLine}${llmComments}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
