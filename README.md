# Supreme Cycle & Rickshaw Company

A fast, accessible static website for the Khalilabad bicycle store, ready for GitHub Pages and the custom domain `supremecycle.in`. It includes retail categories, a searchable bicycle-parts catalogue with line-art product illustrations, wholesale/import credentials (GSTIN and IEC shown in the header), an FAQ with FAQPage structured data, an embedded Google Map, a favicon/manifest set, and separate retail and wholesale WhatsApp enquiries.

## Local checks

## Product catalogue

Edit `site/catalogue-data.json` to maintain products. Each product has a stable `id`, `name`, `brand`, broad `category`, item `type`, a main `image`, and optional alternate `images` and source URL. Unbranded listings are assigned to SCRC per the owner's instruction. Known brands are retained; there are no prices, size selectors, cart, or checkout.

The build renders category and brand links on the homepage and a separate `/catalogue/` page from the same data. Filters are combined (AND) and preserved in shareable query parameters: `category`, `type`, `brand`, `q`. Item types depend on the selected category. Static cards and WhatsApp links remain available without JavaScript.

KW's 29 products and 47 source photos are under `site/products/kw/`. The source URLs remain in the data for review; public availability is not itself reuse permission. Only listed brands appear in navigation. No placeholder products were invented for other brands.

Catalog cards show product names as supplied. Existing site translations remain available; new catalogue editorial copy currently uses English.

## Build and test

```bash
npm test
npm run build
```

The build copies the production-ready files from `site/` to `dist/` without external dependencies.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` validates and deploys the `dist/` directory whenever the default branch is updated. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.

Then set **Custom domain** to `supremecycle.in` in the same Pages settings screen and enable **Enforce HTTPS** after GitHub provisions the certificate.

## DNS records

At the DNS provider, replace the current apex `A` record with all four GitHub Pages addresses:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `iammujtaba.github.io` |

Avoid wildcard DNS records. DNS and HTTPS changes can take time to propagate.
