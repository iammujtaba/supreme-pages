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
  "favicon.ico",
  "favicon.svg",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "site.webmanifest",
  "CNAME",
  "robots.txt",
  "sitemap.xml",
  ".nojekyll",
  "products/derailleur-cable.jpg",
  "products/woven-brake-cable.jpg",
  "products/disc-brake-cable.jpg",
  "products/inner-wire.jpg",
  "products/foot-pump-gauge.jpg",
  "products/dual-cylinder-pump.jpg",
  "products/cable-caps.jpg",
  "products/kids-alloy-cycle.jpg",
  "products/steel-basket.jpg"
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
  [html.includes('"FAQPage"'), "FAQ structured data"],
  [html.includes('"GeoCoordinates"'), "geo coordinates"],
  [html.includes('rel="icon"'), "favicon links"],
  [html.includes('rel="manifest"'), "web manifest link"],
  [html.includes("+919839850588"), "primary phone number"],
  [html.includes("+917888898988"), "wholesale phone number"],
  [html.includes("09BGTPM2524D1ZA"), "GSTIN"],
  [html.includes('id="product-grid"'), "product catalogue"],
  [html.includes('id="featured-products"'), "featured products section"],
  [html.match(/class="product-photo-card reveal"/g)?.length === 9, "9 featured product cards"],
  [html.match(/src="products\//g)?.length === 9, "9 featured product images"],
  [html.includes("https://www.ymbicycleparts.com/products.html"), "product image source credit"],
  [html.match(/data-product-card/g)?.length === 12, "12 product cards"],
  [html.match(/data-product-art/g)?.length === 12, "12 product illustrations"],
  [html.match(/data-category-art/g)?.length === 5, "5 category illustrations"],
  [html.includes('id="faq"'), "FAQ section"],
  [html.includes("output=embed"), "embedded map"],
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
