/*
 * Content-Security-Policy as <meta http-equiv> for hosts that cannot send response headers.
 *
 * For every built HTML page this computes the SHA-256 hashes of that page's inline <script> blocks
 * and writes them into the page's CSP meta tag (placeholder __CSP_SCRIPT_HASHES__), so the policy
 * allows exactly our own inline scripts instead of 'unsafe-inline'. If public/.htaccess contains
 * the placeholder too, it receives the union of all hashes (for hosts that do honour headers).
 *
 * Must run after every step that modifies the HTML (hugo --minify, purgecss, ...).
 * The build fails on anything the CSP would block or that would make the meta tag ineffective:
 *   - inline event handlers (onclick=...) and javascript: URLs
 *   - external scripts from origins not listed in script-src
 *   - a page with inline scripts but without the CSP meta tag
 *   - a CSP meta tag that is not placed before the first script, stylesheet or <base>
 *     (a meta CSP only applies to content after it)
 *
 * Usage: node csp-hashes.mjs [publicDir]
 */

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const rootDir = (process.argv[2] || "public").replace(/\/$/, "");
const placeholder = "__CSP_SCRIPT_HASHES__";
const htaccessPath = path.join(rootDir, ".htaccess");

const scriptRe = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi;
const handlerRe = /<[a-z][^>]*\son[a-z]+\s*=/i;
const jsUrlRe = /\s(?:href|src|action|formaction)\s*=\s*["']?\s*javascript:/i;
const cspMetaRe = /<meta\s[^>]*http-equiv\s*=\s*["']?content-security-policy["']?[^>]*>/i;
const executableTypes = ["", "text/javascript", "application/javascript", "module"];

const attr = (attrs, name) => new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")
    .exec(attrs)?.slice(1).find((v) => v !== undefined);

const sha256 = (body) => `'sha256-${crypto.createHash("sha256").update(body, "utf8").digest("base64")}'`;

const files = (await fs.readdir(rootDir, { recursive: true }))
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join(rootDir, f));

const allHashes = new Set();
const problems = [];
let pagesWithCsp = 0;

for (const file of files) {
    let html = await fs.readFile(file, "utf-8");
    const hashes = new Set();
    const externalScripts = [];

    if (handlerRe.test(html)) {
        problems.push(`${file}: inline event handler (on...=) found – use addEventListener instead`);
    }
    if (jsUrlRe.test(html)) {
        problems.push(`${file}: javascript: URL found`);
    }

    for (const [, attrs = "", body] of html.matchAll(scriptRe)) {
        const src = attr(attrs, "src");
        if (src !== undefined) {
            externalScripts.push(src);
            continue;
        }
        // data blocks (JSON-LD etc.) are not executed and not subject to script-src
        if (!executableTypes.includes((attr(attrs, "type") ?? "").toLowerCase())) {
            continue;
        }
        hashes.add(sha256(body));
    }

    const meta = cspMetaRe.exec(html);
    if (!meta) {
        if (hashes.size || externalScripts.length) {
            problems.push(`${file}: has scripts but no Content-Security-Policy meta tag`);
        }
        continue;
    }
    pagesWithCsp++;

    // A meta CSP only governs what comes after it in the document.
    const head = html.slice(0, meta.index);
    const early = /<(script|style|base)[\s>]|<link\s[^>]*rel\s*=\s*["']?[^"'>]*(stylesheet|preload|modulepreload)/i.exec(head);
    if (early) {
        problems.push(`${file}: <${early[1] ?? "link " + early[2]}> appears before the CSP meta tag – move the meta tag directly after <meta charset>`);
    }

    if (!meta[0].includes(placeholder)) {
        problems.push(`${file}: CSP meta tag does not contain ${placeholder}`);
        continue;
    }

    const sorted = [...hashes].sort((a, b) => a.localeCompare(b));
    sorted.forEach((h) => allHashes.add(h));
    const newMeta = meta[0].replaceAll(placeholder, sorted.join(" ")).replace(/ {2,}/g, " ").replace(/ ;/g, ";");
    html = html.slice(0, meta.index) + newMeta + html.slice(meta.index + meta[0].length);

    // External scripts must come from an origin the policy allows.
    const policy = (attr(newMeta, "content") ?? "").replace(/&#39;|&apos;/g, "'");
    const scriptSrc = policy.split(";").map((d) => d.trim().split(/\s+/)).find(([name]) => name === "script-src")?.slice(1) ?? [];
    for (const src of externalScripts) {
        if (!/^(https?:)?\/\//i.test(src)) continue;
        const origin = new URL(src, "https://placeholder.invalid").origin;
        if (!scriptSrc.some((s) => s === origin || s === `${origin}/` || (s.endsWith("/") && src.startsWith(s)))) {
            problems.push(`${file}: external script ${src} is not allowed by script-src`);
        }
    }

    await fs.writeFile(file, html, "utf-8");
}

if (problems.length) {
    console.error(`❌ CSP check failed:\n  ${problems.join("\n  ")}`);
    process.exit(1);
}
if (!pagesWithCsp) {
    console.error(`❌ No page in ${rootDir} contains a Content-Security-Policy meta tag`);
    process.exit(1);
}

let htaccess;
try {
    htaccess = await fs.readFile(htaccessPath, "utf-8");
} catch {
    htaccess = undefined;
}
if (htaccess?.includes(placeholder)) {
    await fs.writeFile(htaccessPath, htaccess.replaceAll(placeholder, [...allHashes].sort((a, b) => a.localeCompare(b)).join(" ")), "utf-8");
    console.log(`🔒 CSP: ${allHashes.size} inline script hash(es) written to ${htaccessPath}`);
}
console.log(`🔒 CSP: meta policy filled in for ${pagesWithCsp} page(s), ${allHashes.size} distinct inline script hash(es)`);
