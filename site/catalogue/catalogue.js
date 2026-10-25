(() => {
  const form = document.querySelector('#catalogue-filters');
  const search = form.elements.q;
  const category = form.elements.category;
  const type = form.elements.type;
  const brand = form.elements.brand;
  const cards = [...document.querySelectorAll('.catalogue-card')];
  const typeOptions = [...type.options].map(option => ({value: option.value, text: option.textContent}));
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-state');
  const updateTypes = () => {
    const previous = type.value;
    const available = new Set(cards.filter(card => !category.value || card.dataset.category === category.value).map(card => card.dataset.type));
    type.replaceChildren(...typeOptions.filter(option => !option.value || available.has(option.value)).map(option => new Option(option.text, option.value)));
    type.value = [...type.options].some(option => option.value === previous) ? previous : '';
  };
  const apply = (save = true) => {
    const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let matches = 0;
    cards.forEach(card => {
      const visible = (!category.value || card.dataset.category === category.value) && (!type.value || card.dataset.type === type.value) && (!brand.value || card.dataset.brand === brand.value) && words.every(word => card.dataset.search.includes(word));
      card.hidden = !visible;
      if (visible) matches++;
    });
    count.textContent = `${matches} ${matches === 1 ? 'product' : 'products'}${matches !== cards.length ? ` of ${cards.length}` : ''}`;
    empty.hidden = matches !== 0;
    if (save) {
      const params = new URLSearchParams();
      for (const input of [search, category, type, brand]) if (input.value.trim()) params.set(input.name,input.value.trim());
      history.replaceState(null,'',location.pathname + (params.size ? '?' + params : '') + location.hash);
    }
  };
  const restore = () => {
    const params = new URLSearchParams(location.search);
    search.value = (params.get('q') || '').slice(0,120);
    category.value = params.get('category') || '';
    brand.value = params.get('brand') || '';
    updateTypes();
    type.value = params.get('type') || '';
    apply(false);
  };
  form.addEventListener('submit',event => event.preventDefault());
  form.addEventListener('input',() => { updateTypes(); apply(); });
  form.addEventListener('reset',() => { requestAnimationFrame(() => { updateTypes(); apply(); }); });
  document.querySelector('#empty-clear').addEventListener('click',() => form.reset());
  window.addEventListener('popstate',restore);
  restore();
})();
