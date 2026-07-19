import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "site");
const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "translations.js",
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
  "products/woven-brake-cable.jpg",
  "products/cable-ym014.jpg",
  "products/cable-ym013.jpg",
  "products/cable-ym012.jpg",
  "products/pump-ym146.jpg",
  "products/pump-ym147.jpg",
  "products/pump-ym103.jpg",
  "products/pump-ym114.jpg",
  "products/saddle-ym833.jpg",
  "products/saddle-ym832.jpg",
  "products/saddle-ym831.jpg",
  "products/saddle-ym818.jpg",
  "products/axle-ym307.jpg",
  "products/axle-ym303-cups.jpg",
  "products/axle-ym303-set.jpg",
  "products/axle-ym309.jpg",
  "products/pedal-ym902.jpg",
  "products/pedal-ym921.jpg",
  "products/pedal-ym920.jpg",
  "products/pedal-ym919.jpg",
  "products/kids-alloy-cycle.jpg",
  "products/kids-cycle-ym2101.jpg",
  "products/kids-cycle-ym2103.jpg",
  "products/kids-cycle-ym2104.jpg",
  "products/steel-basket.jpg",
  "products/basket-ym201.jpg",
  "products/basket-ym214.jpg",
  "products/basket-ym213.jpg",
  "products/tyre-bedrock-city-rider.jpg",
  "products/tyre-bedrock-fighter.jpg",
  "products/tyre-ralson-tuf-grip.png",
  "products/tyre-hindustan-storm.jpg",
  "products/tube-bedrock-dhamaka.webp",
  "products/tube-ralson-700-28.webp",
  "products/tube-hindustan-27-5.jpeg",
  "products/tube-ralco-26.jpeg",
  "products/other-bottle-carrier-bush.jpg",
  "products/other-bmx-vbrake-bolt.jpg",
  "products/other-vbrake-pivot-bolts.jpg"
];

for (const file of requiredFiles) {
  await access(path.join(site, file), constants.R_OK);
}

const html = await readFile(path.join(site, "index.html"), "utf8");
const css = await readFile(path.join(site, "styles.css"), "utf8");
const js = await readFile(path.join(site, "script.js"), "utf8");
const translationsSource = await readFile(path.join(site, "translations.js"), "utf8");
const buildJs = await readFile(path.join(root, "scripts", "build.mjs"), "utf8");
const translationContext = { window: {} };
vm.runInNewContext(translationsSource, translationContext);
const i18n = translationContext.window.SUPREME_I18N;
const expectedLanguages = ["en", "hi", "zh", "ur", "te", "ta", "kn"];
const translationKeys = new Set([
  ...[...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]),
  ...[...html.matchAll(/data-i18n-html="([^"]+)"/g)].map((match) => match[1]),
  ...[...html.matchAll(/data-i18n-placeholder="([^"]+)"/g)].map((match) => match[1])
]);
const nonEnglishLanguages = expectedLanguages.filter((language) => language !== "en");
const missingTranslations = nonEnglishLanguages.flatMap((language) =>
  [...translationKeys]
    .filter((key) => !i18n?.translations?.[language]?.[key])
    .map((key) => `${language}.${key}`)
);

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
  [html.includes('id="featured-products"'), "featured products section"],
  [html.match(/<button class="catalog-tab/g)?.length === 10, "10 product category tabs"],
  [html.match(/role="tabpanel"/g)?.length === 10, "10 product category panels"],
  [html.match(/<article class="product-photo-card/g)?.length === 40, "40 product cards"],
  [html.match(/src="products\//g)?.length === 39, "39 product images"],
  [!html.includes("Reference catalogue"), "reference catalogue label removed"],
  [!html.includes('id="collection"'), "old collection section removed"],
  [!html.includes('id="products"'), "old product catalogue removed"],
  [!html.includes("What you’ll find here"), "old category section heading removed"],
  [!html.includes("Bicycle parts catalogue"), "old catalogue heading removed"],
  [html.includes("Bedrock City Rider"), "Bedrock tyre range"],
  [html.includes("Ralson Tuf Grip"), "Ralson tyre range"],
  [html.includes("Hindustan Storm"), "Hindustan tyre range"],
  [html.includes("Hatora Product Range"), "Hatora brand range"],
  [html.includes('id="faq"'), "FAQ section"],
  [html.includes("output=embed"), "embedded map"],
  [html.includes('id="enquiry-form"'), "WhatsApp enquiry form"],
  [html.includes('id="language-gate"'), "first-visit language gate"],
  [html.includes('id="language-switcher"'), "persistent language switcher"],
  [html.includes('src="translations.js"'), "translation dictionary script"],
  [expectedLanguages.every((language) => i18n?.languages?.[language]), "seven supported languages"],
  [nonEnglishLanguages.every((language) => i18n?.gate?.[language]?.continue), "localized language gate"],
  [missingTranslations.length === 0, `complete translations${missingTranslations.length ? ` (${missingTranslations.join(", ")})` : ""}`],
  [i18n?.languages?.ur?.dir === "rtl", "Urdu right-to-left direction"],
  [css.includes('.eyebrow > span:first-child:not([data-i18n])'), "translated eyebrow text remains visible"],
  [css.includes('.catalog-tab > span:last-child'), "catalog count badge targets only the count"],
  [!css.includes(".eyebrow span {"), "no broad eyebrow span styling"],
  [!css.includes(".catalog-tab span {"), "no broad catalog tab span styling"],
  [css.includes("@media (max-width: 760px)"), "mobile layout"],
  [css.includes("prefers-reduced-motion"), "reduced-motion support"],
  [js.includes("wa.me/917888898988"), "wholesale WhatsApp integration"],
  [js.includes("activateCatalogTab"), "supplier category tabs"],
  [js.includes("supremePreferredLanguage"), "saved language preference"],
  [js.includes("messageTemplates"), "localized WhatsApp messages"],
  [buildJs.includes('createHash("sha256")'), "content-hashed asset versions"],
  [buildJs.includes('versionedAssets = ["styles.css", "translations.js", "script.js"]'), "critical asset cache busting"]
];

const failures = checks.filter(([ok]) => !ok).map(([, name]) => name);
if (failures.length) {
  throw new Error(`Validation failed: ${failures.join(", ")}`);
}

console.log(`Validated ${requiredFiles.length} files and ${checks.length} content checks.`);
