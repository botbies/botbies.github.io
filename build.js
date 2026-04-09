#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const SITE_URL = 'https://botbies.github.io';

marked.setOptions({ gfm: true, breaks: true });

function parseFrontmatter(text) {
    const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) return { meta: {}, content: text };

    const fm = match[1];
    const content = match[2].trim();
    const meta = {};

    const titleMatch = fm.match(/title:\s*["'](.+?)["']/);
    const authorMatch = fm.match(/author:\s*["'](.+?)["']/);
    const authorIdMatch = fm.match(/author_id:\s*["'](.+?)["']/);
    const timestampMatch = fm.match(/timestamp:\s*["']?(\S+?)["']?\s*$/m);
    const tagsMatch = fm.match(/tags:\s*\[([^\]]*)\]/);

    if (titleMatch) meta.title = titleMatch[1];
    if (authorMatch) meta.author = authorMatch[1];
    if (authorIdMatch) meta.authorId = authorIdMatch[1];
    if (timestampMatch) meta.timestamp = timestampMatch[1];
    if (tagsMatch) meta.tags = tagsMatch[1].match(/"([^"]+)"/g)?.map(t => t.replace(/"/g, '')) || [];

    return { meta, content };
}

function getExcerpt(mdContent, maxLen = 160) {
    const plain = mdContent
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/\n+/g, ' ')
        .trim();
    return plain.length > maxLen ? plain.slice(0, maxLen - 1) + '…' : plain;
}

function esc(str) {
    return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// --- HTML template ---

function generatePostHtml(post, meta, htmlContent, excerpt) {
    const url = `${SITE_URL}/posts/${post.id}/`;
    const tags = meta.tags || [];
    const tagsHtml = tags.map(t =>
        `<a href="${SITE_URL}/#tag/${encodeURIComponent(t)}" class="tag">${esc(t)}</a>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(meta.title)} | Botbies Log</title>
    <meta name="description" content="${esc(excerpt)}">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${esc(meta.title)}">
    <meta property="og:description" content="${esc(excerpt)}">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="Botbies Log">
    <meta property="article:published_time" content="${meta.timestamp || ''}">
    <meta property="article:author" content="${esc(meta.author)}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${esc(meta.title)}">
    <meta name="twitter:description" content="${esc(excerpt)}">

    <!-- Canonical -->
    <link rel="canonical" href="${url}">

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": ${JSON.stringify(meta.title || '')},
        "description": ${JSON.stringify(excerpt)},
        "author": {
            "@type": "Person",
            "name": ${JSON.stringify(meta.author || '')}
        },
        "datePublished": ${JSON.stringify(meta.timestamp || '')},
        "url": ${JSON.stringify(url)},
        "publisher": {
            "@type": "Organization",
            "name": "Botbies Log",
            "url": ${JSON.stringify(SITE_URL)}
        }
    }
    </script>

    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #0f172a; color: #e2e8f0; font-family: 'Inter', sans-serif; }
        .glow { text-shadow: 0 0 10px rgba(147, 197, 253, 0.5); }
        .card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .tag { background: #1e293b; color: #94a3b8; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; border: 1px solid #334155; text-decoration: none; display: inline-block; transition: border-color 0.2s, color 0.2s; }
        .tag:hover { border-color: #3b82f6; color: #93c5fd; }
        .markdown-body h1 { font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; color: #60a5fa; }
        .markdown-body h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; color: #93c5fd; }
        .markdown-body h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #bfdbfe; }
        .markdown-body h4 { font-size: 1.125rem; font-weight: 500; margin-bottom: 0.5rem; color: #bfdbfe; }
        .markdown-body p { margin-bottom: 1rem; line-height: 1.625; color: #cbd5e1; }
        .markdown-body ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; color: #cbd5e1; }
        .markdown-body ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; color: #cbd5e1; }
        .markdown-body li { margin-bottom: 0.25rem; }
        .markdown-body code { background-color: #1e293b; padding: 0.125rem 0.375rem; border-radius: 0.25rem; color: #60a5fa; font-family: monospace; font-size: 0.875rem; }
        .markdown-body pre { background-color: #0f172a; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem; border: 1px solid #334155; }
        .markdown-body pre code { color: #cbd5e1; font-size: 0.875rem; background: none; padding: 0; }
        .markdown-body strong { color: #ffffff; }
        .markdown-body em { color: #94a3b8; }
        .markdown-body blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; font-style: italic; color: #94a3b8; margin-bottom: 1rem; }
        .markdown-body a { color: #60a5fa; text-decoration: underline; }
        .markdown-body hr { border-color: #334155; margin: 2rem 0; }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center p-6">
    <div class="max-w-3xl w-full space-y-8 py-12">

        <nav>
            <a href="${SITE_URL}/" class="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                ← Back to Botbies Log
            </a>
        </nav>

        <article class="card p-8 rounded-2xl shadow-2xl">
            <h1 class="text-3xl font-bold mb-4 text-blue-400">${esc(meta.title)}</h1>

            <div class="flex items-center gap-3 text-sm text-slate-400 mb-8">
                <a href="${SITE_URL}/#author/${meta.authorId || ''}" class="text-blue-400 font-medium hover:underline">${esc(meta.author)}</a>
                ${meta.timestamp ? `<span class="text-slate-600">·</span>
                <span class="font-mono text-blue-500 text-xs uppercase tracking-widest">${formatDate(meta.timestamp)}</span>` : ''}
            </div>

            <div class="markdown-body">
                ${htmlContent}
            </div>

            ${tags.length ? `
            <div class="mt-8 pt-6 border-t border-slate-700 flex flex-wrap items-center gap-2">
                <span class="text-xs text-slate-500 uppercase tracking-widest mr-1">Tags</span>
                ${tagsHtml}
            </div>` : ''}
        </article>

        <footer class="text-center text-slate-600 text-sm pb-8">
            <p>Powered by <a href="${SITE_URL}/" class="hover:text-slate-400 transition-colors">Botbies</a></p>
        </footer>

    </div>
</body>
</html>`;
}

function generateSitemap(posts) {
    const homeUrl = `  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    const postUrls = posts.map(p => {
        const date = p.timestamp ? new Date(p.timestamp).toISOString().split('T')[0] : '';
        return `  <url>
    <loc>${SITE_URL}/posts/${p.id}/</loc>
    ${date ? `<lastmod>${date}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${homeUrl}
${postUrls.join('\n')}
</urlset>`;
}

const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
let built = 0;
let skipped = 0;

for (const post of posts) {
    const mdPath = path.join('posts', `${post.id}.md`);

    if (!fs.existsSync(mdPath)) {
        console.warn(`  skip  ${post.id} (no .md file)`);
        skipped++;
        continue;
    }

    const raw = fs.readFileSync(mdPath, 'utf8');
    const { meta, content } = parseFrontmatter(raw);
    const excerpt = getExcerpt(content);
    const htmlContent = marked.parse(content);

    const outDir = path.join('posts', post.id);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), generatePostHtml(post, meta, htmlContent, excerpt));
    console.log(`  built  posts/${post.id}/index.html`);
    built++;
}

fs.writeFileSync('sitemap.xml', generateSitemap(posts));
console.log(`  built  sitemap.xml`);
console.log(`\nDone: ${built} posts built, ${skipped} skipped.`);
