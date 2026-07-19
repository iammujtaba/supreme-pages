const i18nConfig = window.SUPREME_I18N || { languages: { en: { locale: "en-IN", dir: "ltr" } }, gate: {}, translations: {}, productTypes: {} };
const languageStorageKey = "supremePreferredLanguage";
const supportedLanguages = new Set(Object.keys(i18nConfig.languages));
const languageGate = document.querySelector("#language-gate");
const languageOptions = [...document.querySelectorAll("[data-language-option]")];
const languageContinue = document.querySelector("#language-continue");
const languageSwitcher = document.querySelector("#language-switcher");
const textTranslations = [...document.querySelectorAll("[data-i18n]")];
const htmlTranslations = [...document.querySelectorAll("[data-i18n-html]")];
const placeholderTranslations = [...document.querySelectorAll("[data-i18n-placeholder]")];
const productTypeLabels = [...document.querySelectorAll(".product-photo-card__type")];
const productEnquiryButtons = [...document.querySelectorAll(".product-enquiry")];

textTranslations.forEach((element) => {
  element.dataset.i18nOriginal = element.textContent;
});

htmlTranslations.forEach((element) => {
  element.dataset.i18nOriginalHtml = element.innerHTML;
});

placeholderTranslations.forEach((element) => {
  element.dataset.i18nOriginalPlaceholder = element.getAttribute("placeholder") || "";
});

productTypeLabels.forEach((element) => {
  element.dataset.i18nOriginal = element.textContent.trim();
});

productEnquiryButtons.forEach((button) => {
  button.dataset.priceKind = button.closest('[data-catalog-panel="kids"]') ? "kidsPrice" : "productPrice";
});

const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem(languageStorageKey);
    return supportedLanguages.has(saved) ? saved : null;
  } catch (error) {
    return null;
  }
};

const saveLanguage = (language) => {
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch (error) {
    // The selected language still works for this visit when storage is unavailable.
  }
};

const gateCopyFor = (language) => i18nConfig.gate[language] || i18nConfig.gate.en || {};
const copyFor = (language) => i18nConfig.translations[language] || {};
let currentLanguage = "en";
let pendingLanguage = "en";

const applyGateLanguage = (language) => {
  const copy = gateCopyFor(language);
  languageGate?.setAttribute("lang", i18nConfig.languages[language]?.locale || language);
  languageGate?.setAttribute("dir", i18nConfig.languages[language]?.dir || "ltr");
  document.querySelectorAll("[data-gate-i18n]").forEach((element) => {
    const key = element.dataset.gateI18n;
    if (copy[key]) element.textContent = copy[key];
  });

  languageOptions.forEach((option) => {
    const isSelected = option.dataset.languageOption === language;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-checked", String(isSelected));
    option.tabIndex = isSelected ? 0 : -1;
  });
};

const messageTemplates = {
  en: {
    product: (product) => `Hello Supreme Cycle, I want to enquire about ${product}. Please share available brands, sizes, wholesale quantity and current price.`,
    hello: (name) => `Hello Supreme Cycle, my name is ${name}.`,
    buyer: (buyerType) => `Buyer type: ${buyerType}.`,
    business: (business) => `Business / firm: ${business}.`,
    state: (state) => `Delivery state / region: ${state}.`,
    gst: (gstin) => `GSTIN: ${gstin}.`,
    looking: (interest) => `I am looking for: ${interest}.`,
    quantity: (quantity) => `Approximate quantity: ${quantity}.`,
    details: (details) => `Details: ${details}`,
    request: "Please share current options and prices."
  },
  hi: {
    product: (product) => `नमस्ते Supreme Cycle, मुझे ${product} के बारे में जानकारी चाहिए। कृपया उपलब्ध ब्रांड, साइज़, थोक मात्रा और मौजूदा कीमत बताएँ।`,
    hello: (name) => `नमस्ते Supreme Cycle, मेरा नाम ${name} है।`,
    buyer: (buyerType) => `खरीदार का प्रकार: ${buyerType}।`,
    business: (business) => `व्यवसाय / फर्म: ${business}।`,
    state: (state) => `डिलीवरी राज्य / क्षेत्र: ${state}।`,
    gst: (gstin) => `GSTIN: ${gstin}।`,
    looking: (interest) => `मुझे चाहिए: ${interest}।`,
    quantity: (quantity) => `अनुमानित मात्रा: ${quantity}।`,
    details: (details) => `विवरण: ${details}`,
    request: "कृपया मौजूदा विकल्प और कीमतें बताएँ।"
  },
  zh: {
    product: (product) => `您好 Supreme Cycle，我想咨询 ${product}。请告知可选品牌、尺寸、批发数量和当前价格。`,
    hello: (name) => `您好 Supreme Cycle，我叫${name}。`,
    buyer: (buyerType) => `买家类型：${buyerType}。`,
    business: (business) => `企业 / 商号：${business}。`,
    state: (state) => `配送邦 / 地区：${state}。`,
    gst: (gstin) => `GSTIN：${gstin}。`,
    looking: (interest) => `我正在寻找：${interest}。`,
    quantity: (quantity) => `预计数量：${quantity}。`,
    details: (details) => `详细信息：${details}`,
    request: "请提供目前可选产品和价格。"
  },
  ur: {
    product: (product) => `السلام علیکم Supreme Cycle، مجھے ${product} کے بارے میں معلومات چاہیے۔ دستیاب برانڈ، سائز، تھوک مقدار اور موجودہ قیمت بتائیں۔`,
    hello: (name) => `السلام علیکم Supreme Cycle، میرا نام ${name} ہے۔`,
    buyer: (buyerType) => `خریدار کی قسم: ${buyerType}۔`,
    business: (business) => `کاروبار / فرم: ${business}۔`,
    state: (state) => `ڈیلیوری ریاست / علاقہ: ${state}۔`,
    gst: (gstin) => `GSTIN: ${gstin}۔`,
    looking: (interest) => `مجھے چاہیے: ${interest}۔`,
    quantity: (quantity) => `اندازاً مقدار: ${quantity}۔`,
    details: (details) => `تفصیلات: ${details}`,
    request: "براہِ کرم موجودہ اختیارات اور قیمتیں بتائیں۔"
  },
  te: {
    product: (product) => `నమస్తే Supreme Cycle, నాకు ${product} గురించి సమాచారం కావాలి. అందుబాటులో ఉన్న బ్రాండ్లు, సైజులు, హోల్‌సేల్ పరిమాణం మరియు ప్రస్తుత ధర తెలియజేయండి.`,
    hello: (name) => `నమస్తే Supreme Cycle, నా పేరు ${name}.`,
    buyer: (buyerType) => `కొనుగోలుదారు రకం: ${buyerType}.`,
    business: (business) => `వ్యాపారం / సంస్థ: ${business}.`,
    state: (state) => `డెలివరీ రాష్ట్రం / ప్రాంతం: ${state}.`,
    gst: (gstin) => `GSTIN: ${gstin}.`,
    looking: (interest) => `నాకు కావాల్సింది: ${interest}.`,
    quantity: (quantity) => `అంచనా పరిమాణం: ${quantity}.`,
    details: (details) => `వివరాలు: ${details}`,
    request: "ప్రస్తుత ఎంపికలు మరియు ధరలు తెలియజేయండి."
  },
  ta: {
    product: (product) => `வணக்கம் Supreme Cycle, ${product} பற்றி விசாரிக்க விரும்புகிறேன். கிடைக்கும் பிராண்டுகள், அளவுகள், மொத்த அளவு மற்றும் தற்போதைய விலையைப் பகிரவும்.`,
    hello: (name) => `வணக்கம் Supreme Cycle, என் பெயர் ${name}.`,
    buyer: (buyerType) => `வாங்குபவர் வகை: ${buyerType}.`,
    business: (business) => `வணிகம் / நிறுவனம்: ${business}.`,
    state: (state) => `டெலிவரி மாநிலம் / பகுதி: ${state}.`,
    gst: (gstin) => `GSTIN: ${gstin}.`,
    looking: (interest) => `நான் தேடுவது: ${interest}.`,
    quantity: (quantity) => `தோராயமான அளவு: ${quantity}.`,
    details: (details) => `விவரங்கள்: ${details}`,
    request: "தற்போதைய விருப்பங்கள் மற்றும் விலைகளைப் பகிரவும்."
  },
  kn: {
    product: (product) => `ನಮಸ್ಕಾರ Supreme Cycle, ನನಗೆ ${product} ಕುರಿತು ಮಾಹಿತಿ ಬೇಕು. ಲಭ್ಯವಿರುವ ಬ್ರಾಂಡ್‌ಗಳು, ಗಾತ್ರಗಳು, ಸಗಟು ಪ್ರಮಾಣ ಮತ್ತು ಪ್ರಸ್ತುತ ಬೆಲೆ ತಿಳಿಸಿ.`,
    hello: (name) => `ನಮಸ್ಕಾರ Supreme Cycle, ನನ್ನ ಹೆಸರು ${name}.`,
    buyer: (buyerType) => `ಖರೀದಿದಾರರ ಪ್ರಕಾರ: ${buyerType}.`,
    business: (business) => `ವ್ಯಾಪಾರ / ಸಂಸ್ಥೆ: ${business}.`,
    state: (state) => `ವಿತರಣೆ ರಾಜ್ಯ / ಪ್ರದೇಶ: ${state}.`,
    gst: (gstin) => `GSTIN: ${gstin}.`,
    looking: (interest) => `ನಾನು ಹುಡುಕುತ್ತಿರುವುದು: ${interest}.`,
    quantity: (quantity) => `ಅಂದಾಜು ಪ್ರಮಾಣ: ${quantity}.`,
    details: (details) => `ವಿವರಗಳು: ${details}`,
    request: "ಪ್ರಸ್ತುತ ಆಯ್ಕೆಗಳು ಮತ್ತು ಬೆಲೆಗಳನ್ನು ತಿಳಿಸಿ."
  }
};

const applyLanguage = (language) => {
  const nextLanguage = supportedLanguages.has(language) ? language : "en";
  const languageDetails = i18nConfig.languages[nextLanguage] || i18nConfig.languages.en;
  const copy = copyFor(nextLanguage);
  const typeCopy = i18nConfig.productTypes[nextLanguage] || {};

  currentLanguage = nextLanguage;
  document.documentElement.lang = languageDetails.locale || nextLanguage;
  document.documentElement.dir = languageDetails.dir || "ltr";
  document.body.classList.toggle("is-rtl", languageDetails.dir === "rtl");

  textTranslations.forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = nextLanguage === "en" ? element.dataset.i18nOriginal : copy[key] || element.dataset.i18nOriginal;
  });

  htmlTranslations.forEach((element) => {
    const key = element.dataset.i18nHtml;
    element.innerHTML = nextLanguage === "en" ? element.dataset.i18nOriginalHtml : copy[key] || element.dataset.i18nOriginalHtml;
  });

  placeholderTranslations.forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    const value = nextLanguage === "en" ? element.dataset.i18nOriginalPlaceholder : copy[key] || element.dataset.i18nOriginalPlaceholder;
    element.setAttribute("placeholder", value);
  });

  productTypeLabels.forEach((element) => {
    const original = element.dataset.i18nOriginal;
    element.textContent = nextLanguage === "en" ? original : typeCopy[original] || original;
  });

  productEnquiryButtons.forEach((button) => {
    const label = nextLanguage === "en"
      ? button.dataset.priceKind === "kidsPrice" ? "Check sizes & price" : "Get wholesale price"
      : copy[button.dataset.priceKind] || "Get wholesale price";
    const textNode = [...button.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.nodeValue = `${label} `;
  });

  if (languageSwitcher) {
    languageSwitcher.value = nextLanguage;
    languageSwitcher.setAttribute("aria-label", copy.languageLabel || "Language");
  }

  document.documentElement.dataset.preferredLanguage = nextLanguage;
  document.documentElement.classList.remove("language-loading");
  updateOpenStatus();
};

languageOptions.forEach((option, index) => {
  option.addEventListener("click", () => {
    pendingLanguage = option.dataset.languageOption || "en";
    applyGateLanguage(pendingLanguage);
  });

  option.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextOption = languageOptions[(index + direction + languageOptions.length) % languageOptions.length];
    pendingLanguage = nextOption.dataset.languageOption || "en";
    applyGateLanguage(pendingLanguage);
    nextOption.focus();
  });
});

languageContinue?.addEventListener("click", () => {
  saveLanguage(pendingLanguage);
  applyLanguage(pendingLanguage);
  document.documentElement.classList.remove("language-choice-pending");
  languageGate?.setAttribute("aria-hidden", "true");
  document.querySelector("#main-content")?.focus({ preventScroll: true });
});

languageSwitcher?.addEventListener("change", (event) => {
  const language = event.target.value;
  saveLanguage(language);
  applyLanguage(language);
  closeMenu();
});

const header = document.querySelector("#site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
const form = document.querySelector("#enquiry-form");
const formStatus = document.querySelector("#form-status");
const catalogTabs = [...document.querySelectorAll("[data-catalog-tab]")];
const catalogPanels = document.querySelectorAll("[data-catalog-panel]");

const closeMenu = () => {
  if (!menuButton || !nav) return;
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  nav?.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const activateCatalogTab = (tab) => {
  const category = tab.dataset.catalogTab;

  catalogTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  catalogPanels.forEach((panel) => {
    const isActive = panel.dataset.catalogPanel === category;
    panel.hidden = !isActive;
    if (isActive) {
      window.requestAnimationFrame(() => {
        panel.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
      });
    }
  });
};

catalogTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateCatalogTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % catalogTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + catalogTabs.length) % catalogTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = catalogTabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = catalogTabs[nextIndex];
    activateCatalogTab(nextTab);
    nextTab.focus();
  });
});

document.querySelectorAll(".product-enquiry").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product || "a bicycle part";
    const templates = messageTemplates[currentLanguage] || messageTemplates.en;
    const message = templates.product(product);
    window.open(`https://wa.me/917888898988?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    formStatus.textContent = copyFor(currentLanguage).formValidation || "Please complete all required fields.";
    return;
  }

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const business = String(data.get("business") || "").trim();
  const buyerType = String(data.get("buyerType") || "").trim();
  const selectedBuyerType = form.elements.buyerType.selectedOptions[0]?.textContent.trim() || buyerType;
  const state = String(data.get("state") || "").trim();
  const gstin = String(data.get("gstin") || "").trim();
  const interest = String(data.get("interest") || "").trim();
  const selectedInterest = form.elements.interest.selectedOptions[0]?.textContent.trim() || interest;
  const quantity = String(data.get("quantity") || "").trim();
  const details = String(data.get("message") || "").trim();
  const templates = messageTemplates[currentLanguage] || messageTemplates.en;
  const lines = [
    templates.hello(name),
    templates.buyer(selectedBuyerType),
    business ? templates.business(business) : null,
    templates.state(state),
    templates.looking(selectedInterest),
    quantity ? templates.quantity(quantity) : null,
    gstin ? templates.gst(gstin) : null,
    details ? templates.details(details) : templates.request
  ].filter(Boolean);

  const whatsappNumber = buyerType === "Individual retail customer" ? "919839850588" : "917888898988";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  formStatus.textContent = copyFor(currentLanguage).openingWhatsapp || "Opening WhatsApp…";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

function updateOpenStatus() {
  const status = document.querySelector("#open-status");
  if (!status) return;

  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
  const totalMinutes = hour * 60 + minute;
  const isFriday = weekday === "Fri";
  const isOpen = !isFriday && totalMinutes >= 540 && totalMinutes < 1170;
  const copy = copyFor(currentLanguage);

  status.textContent = isFriday
    ? copy.closedFriday || "Closed Friday"
    : isOpen
      ? copy.openNow || "Open now"
      : copy.closedNow || "Closed now";
}

const initialLanguage = getSavedLanguage() || "en";
pendingLanguage = initialLanguage;
applyGateLanguage(pendingLanguage);
applyLanguage(initialLanguage);
document.querySelector("#year").textContent = String(new Date().getFullYear());
