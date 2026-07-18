import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "site");
const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "og.png",
  "wholesale-parts-banner.png",
  "CNAME",
  "robots.txt",
  "sitemap.xml",
  ".nojekyll"
];

for (const file of requiredFiles) {
  await access(path.join(site, file), constants.R_OK);
}

const html = await readFile(path.join(site, "index.html"), "utf8");
const css = await readFile(path.join(site, "styles.css"), "utf8");
const js = await readFile(path.join(site, "script.js"), "utf8");

const checks = [
  [html.includes("<title>Supreme Cycle &amp; Rickshaw Company"), "site title"],
  [html.includes('href="https://supremecycle.in/"'), "canonical URL"],
  [html.includes("application/ld+json"), "structured data"],
  [html.includes("+919839850588"), "primary phone number"],
  [html.includes("+917888898988"), "wholesale phone number"],
  [html.includes("09BGTPM2524D1ZA"), "GSTIN"],
  [html.includes('id="product-grid"'), "product catalogue"],
  [html.match(/data-product-card/g)?.length === 12, "12 product cards"],
  [html.includes('id="enquiry-form"'), "WhatsApp enquiry form"],
  [css.includes("@media (max-width: 760px)"), "mobile layout"],
  [css.includes("prefers-reduced-motion"), "reduced-motion support"],
  [js.includes("wa.me/917888898988"), "wholesale WhatsApp integration"],
  [js.includes("filterProducts"), "product filtering"]
];

const failures = checks.filter(([ok]) => !ok).map(([, name]) => name);
if (failures.length) {
  throw new Error(`Validation failed: ${failures.join(", ")}`);
}

console.log(`Validated ${requiredFiles.length} files and ${checks.length} content checks.`);
