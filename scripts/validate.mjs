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
  "gallery/index.html",
  "gallery/gallery.css",
  "gallery/gallery.js",
  "gallary/index.html",
  ...Array.from({ length: 32 }, (_, index) => `gallery/images/supreme-gallery-${String(index + 1).padStart(2, "0")}.jpg`),
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
const galleryHtml = await readFile(path.join(site, "gallery", "index.html"), "utf8");
const galleryCss = await readFile(path.join(site, "gallery", "gallery.css"), "utf8");
const galleryJs = await readFile(path.join(site, "gallery", "gallery.js"), "utf8");
const galleryAliasHtml = await readFile(path.join(site, "gallary", "index.html"), "utf8");
const sitemapXml = await readFile(path.join(site, "sitemap.xml"), "utf8");
const translationsSource = await readFile(path.join(site, "translations.js"), "utf8");
const buildJs = await readFile(path.join(root, "scripts", "build.mjs"), "utf8");
const translationContext = { window: {} };
vm.runInNewContext(translationsSource, translationContext);
const i18n = translationContext.window.SUPREME_I18N;
const expectedLanguages = ["en", "hi", "zh", "ur", "te", "ta", "kn"];
const translationKeys = new Set([
  ...[...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]),
  ...[...html.matchAll(/data-i18n-html="([^"]+)"/g)].map((match) => match[1]),
  ...[...html.matchAll(/data-i18n-placeholder="([^"]+)"/g)].map((match) => match[1]),
  ...[...galleryHtml.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]),
  ...[...galleryHtml.matchAll(/data-i18n-html="([^"]+)"/g)].map((match) => match[1])
]);
const nonEnglishLanguages = expectedLanguages.filter((language) => language !== "en");
const missingTranslations = nonEnglishLanguages.flatMap((language) =>
  [...translationKeys]
    .filter((key) => !i18n?.translations?.[language]?.[key])
    .map((key) => `${language}.${key}`)
);
const structuredDataBlocks = [html, galleryHtml].flatMap((document) =>
  [...document.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1])
);

for (const block of structuredDataBlocks) {
  JSON.parse(block);
}

const checks = [
  [html.includes("<title>Supreme Cycle Khalilabad | Cycle Shop &amp; Wholesale Parts</title>"), "brand and local search title"],
  [html.includes('name="description" content="Supreme Cycle &amp; Rickshaw Company is a trusted cycle shop in Khalilabad'), "brand and local meta description"],
  [html.includes('name="robots" content="index, follow, max-image-preview:large'), "indexable homepage with large image previews"],
  [html.includes('href="https://supremecycle.in/"'), "canonical URL"],
  [html.includes("application/ld+json"), "structured data"],
  [structuredDataBlocks.length === 3, "three valid structured data documents"],
  [html.includes('"FAQPage"'), "FAQ structured data"],
  [html.includes('"GeoCoordinates"'), "geo coordinates"],
  [html.includes('"@id": "https://supremecycle.in/#store"'), "stable local business entity ID"],
  [html.includes('"alternateName": ["Supreme Cycle Khalilabad"'), "local business alternate name"],
  [html.includes('"hasMap": "https://maps.app.goo.gl/867iqRDY9ZC8xCPKA"'), "Google Maps entity connection"],
  [html.includes('"hasOfferCatalog"') && html.includes('"OfferCatalog"'), "business product catalogue structured data"],
  [html.includes('rel="icon"'), "favicon links"],
  [html.includes('rel="manifest"'), "web manifest link"],
  [html.includes("+919839850588"), "primary phone number"],
  [html.includes("+917888898988"), "wholesale phone number"],
  [html.includes("09BGTPM2524D1ZA"), "GSTIN"],
  [html.includes('id="featured-products"'), "featured products section"],
  [html.includes('id="network"'), "office and dispatch network section"],
  [html.includes('id="ordering"'), "wholesale ordering section"],
  [html.includes("Ludhiana, Punjab"), "Ludhiana dispatch warehouse"],
  [html.includes("Next-day dispatch"), "next-day dispatch promise"],
  [html.includes('"@type": "Country"') && html.includes('"name": "India"'), "India-wide structured service area"],
  [html.includes("warehouse address is not published"), "Ludhiana address privacy note"],
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
  [html.includes('name="business"'), "business enquiry field"],
  [html.includes('name="buyerType"'), "buyer type enquiry field"],
  [html.includes('name="state"'), "delivery state enquiry field"],
  [html.includes('name="gstin"'), "GSTIN enquiry field"],
  [html.includes('name="quantity"'), "quantity enquiry field"],
  [html.includes('id="language-gate"'), "first-visit language gate"],
  [html.includes('id="language-switcher"'), "persistent language switcher"],
  [html.includes('src="translations.js"'), "translation dictionary script"],
  [html.includes('href="gallery/"') && html.includes('data-i18n="navGallery"'), "homepage gallery navigation"],
  [galleryHtml.includes('href="https://supremecycle.in/gallery/"'), "gallery canonical URL"],
  [galleryHtml.includes("<title>Cycle Shop in Khalilabad – Store Gallery | Supreme Cycle</title>"), "local gallery search title"],
  [galleryHtml.includes('name="robots" content="index, follow, max-image-preview:large'), "indexable gallery with large image previews"],
  [galleryHtml.includes('"ImageGallery"') && galleryHtml.includes('"BreadcrumbList"'), "gallery and breadcrumb structured data"],
  [galleryHtml.match(/<button class="gallery-card/g)?.length === 32, "32 owner gallery photos"],
  [galleryHtml.match(/data-gallery-item/g)?.length === 32, "32 interactive gallery items"],
  [galleryHtml.includes('id="gallery-lightbox"') && galleryHtml.includes("maps.app.goo.gl/867iqRDY9ZC8xCPKA"), "gallery lightbox and Maps source"],
  [galleryCss.includes("grid-auto-flow: dense") && galleryCss.includes("@media (max-width: 480px)"), "responsive gallery grid"],
  [galleryCss.includes("prefers-reduced-motion"), "gallery reduced-motion support"],
  [galleryJs.includes("showModal") && galleryJs.includes('event.key === "ArrowLeft"') && galleryJs.includes('event.key === "ArrowRight"'), "accessible gallery lightbox controls"],
  [galleryAliasHtml.includes('url=/gallery/') && galleryAliasHtml.includes("location.replace('/gallery/'"), "misspelled gallery route redirect"],
  [galleryAliasHtml.includes('name="robots" content="noindex, follow"'), "gallery alias excluded from search index"],
  [sitemapXml.includes("https://supremecycle.in/gallery/"), "gallery sitemap URL"],
  [sitemapXml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), "image sitemap namespace"],
  [sitemapXml.match(/<image:image>/g)?.length === 33, "33 sitemap image entries"],
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
  [js.includes('buyerType === "Individual retail customer"'), "B2B and retail enquiry routing"],
  [buildJs.includes('createHash("sha256")'), "content-hashed asset versions"],
  [buildJs.includes('file: "gallery/index.html"') && buildJs.includes('file: "gallery/gallery.css"') && buildJs.includes('file: "gallery/gallery.js"'), "gallery asset cache busting"]
];

const failures = checks.filter(([ok]) => !ok).map(([, name]) => name);
if (failures.length) {
  throw new Error(`Validation failed: ${failures.join(", ")}`);
}

console.log(`Validated ${requiredFiles.length} files and ${checks.length} content checks.`);
