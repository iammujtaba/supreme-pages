# Supreme Cycle & Rickshaw Company

A fast, accessible static website for the Khalilabad bicycle store, ready for GitHub Pages and the custom domain `supremecycle.in`. It includes retail categories, a searchable bicycle-parts catalogue, wholesale/import credentials, and separate retail and wholesale WhatsApp enquiries.

## Local checks

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
