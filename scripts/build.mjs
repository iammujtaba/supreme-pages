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

const versionedAssets = ["styles.css", "translations.js", "script.js"];
const indexPath = path.join(output, "index.html");
let html = await readFile(indexPath, "utf8");

for (const asset of versionedAssets) {
  const contents = await readFile(path.join(output, asset));
  const version = createHash("sha256").update(contents).digest("hex").slice(0, 12);
  html = html
    .replaceAll(`href="${asset}"`, `href="${asset}?v=${version}"`)
    .replaceAll(`src="${asset}"`, `src="${asset}?v=${version}"`);
}

await writeFile(indexPath, html, "utf8");

if (versionedAssets.some((asset) => !html.includes(`${asset}?v=`))) {
  throw new Error("Build failed to add versioned URLs for critical assets.");
}

console.log("Built static site in dist/ with versioned CSS and JavaScript URLs.");
