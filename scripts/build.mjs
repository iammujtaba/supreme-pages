import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "site");
const output = path.join(root, "dist");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const pages = [
  {
    file: "index.html",
    assets: [
      { file: "styles.css", url: "styles.css" },
      { file: "translations.js", url: "translations.js" },
      { file: "script.js", url: "script.js" }
    ]
  },
  {
    file: "gallery/index.html",
    assets: [
      { file: "styles.css", url: "../styles.css" },
      { file: "translations.js", url: "../translations.js" },
      { file: "script.js", url: "../script.js" },
      { file: "gallery/gallery.css", url: "gallery.css" },
      { file: "gallery/gallery.js", url: "gallery.js" }
    ]
  }
];

for (const page of pages) {
  const pagePath = path.join(output, page.file);
  let html = await readFile(pagePath, "utf8");

  for (const asset of page.assets) {
    const contents = await readFile(path.join(output, asset.file));
    const version = createHash("sha256").update(contents).digest("hex").slice(0, 12);
    html = html
      .replaceAll(`href="${asset.url}"`, `href="${asset.url}?v=${version}"`)
      .replaceAll(`src="${asset.url}"`, `src="${asset.url}?v=${version}"`);
  }

  if (page.assets.some((asset) => !html.includes(`${asset.url}?v=`))) {
    throw new Error(`Build failed to add versioned URLs to ${page.file}.`);
  }

  await writeFile(pagePath, html, "utf8");
}

console.log("Built static site in dist/ with versioned CSS and JavaScript URLs for all pages.");
