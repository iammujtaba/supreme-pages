import { readFile } from 'node:fs/promises';

export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function loadCatalogue(site) {
  return JSON.parse(await readFile(new URL('catalogue-data.json', site), 'utf8'));
}
export function renderCatalogue(html, data, page) {
  const e = escapeHTML;
  const brands = [...new Set(data.products.map(p => p.brand))].sort((a,b) => a === 'SCRC' ? -1 : b === 'SCRC' ? 1 : a.localeCompare(b));
  const types = [...new Set(data.products.map(p => p.type))].sort();
  const options = items => items.map(([id,name]) => `<option value="${e(id)}">${e(name)}</option>`).join('');
  const link = (key, value) => `catalogue/?${key}=${encodeURIComponent(value)}`;
  if (page === 'home') return html
    .replace('<!-- CATEGORY_CARDS -->', data.categories.map((c,i) => `<a class="category-card category-card--${c.id}" href="${link('category',c.id)}"><div class="category-image"><img src="${e(c.image)}" alt="${e(c.name)}" loading="lazy" width="480" height="360"><span class="category-number">0${i+1}</span></div><div class="category-copy"><h3>${e(c.name)} <span aria-hidden="true">↗</span></h3><p>${e(c.text)}</p></div></a>`).join(''))
    .replace('<!-- BRAND_CARDS -->', brands.map(brand => `<a class="brand-tile" href="${link('brand',brand)}"><strong>${e(brand)}</strong><span>${data.products.filter(p => p.brand === brand).length} products <b aria-hidden="true">↗</b></span></a>`).join(''));
  return html.replace('<!-- CATEGORY_OPTIONS -->',options(data.categories.map(c=>[c.id,c.name])))
    .replace('<!-- TYPE_OPTIONS -->',options(types.map(t=>[t,t])))
    .replace('<!-- BRAND_OPTIONS -->',options(brands.map(b=>[b,b])))
    .replace('<!-- PRODUCT_COUNT -->',data.products.length)
    .replace('<!-- PRODUCT_CARDS -->',data.products.map(p => {
      const message = `Hello Supreme Cycle, I want to enquire about ${p.name} (${p.brand}). Product reference: ${p.id}. Please share availability and details.`;
      return `<article class="catalogue-card" data-id="${e(p.id)}" data-category="${e(p.category)}" data-type="${e(p.type)}" data-brand="${e(p.brand)}" data-search="${e([p.name,p.brand,p.type,p.reference||''].join(' ').toLowerCase())}"><div class="catalogue-photo${p.imageFit==='cover'?' catalogue-photo--cover':''}"><img src="../${e(p.image)}" alt="${e(p.name)}" width="480" height="360" loading="lazy" decoding="async"></div><div class="catalogue-card-copy"><div class="product-meta"><span>${e(p.brand)}</span><span>${e(p.type)}</span></div><h2>${e(p.name)}</h2><a class="enquire-link" href="https://wa.me/917888898988?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp <span aria-hidden="true">↗</span></a></div></article>`;
    }).join(''));
}
