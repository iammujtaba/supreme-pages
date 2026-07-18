const header = document.querySelector("#site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
const form = document.querySelector("#enquiry-form");
const interestField = document.querySelector("#interest");
const formStatus = document.querySelector("#form-status");
const productSearch = document.querySelector("#product-search");
const productFilters = document.querySelectorAll(".product-filter");
const productCards = document.querySelectorAll("[data-product-card]");
const productCount = document.querySelector("#product-count");
const productEmpty = document.querySelector("#product-empty");

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

document.querySelectorAll(".inquiry-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    if (interestField) interestField.value = button.dataset.interest || "";
    document.querySelector("#enquire")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => document.querySelector("#name")?.focus(), 500);
  });
});

let activeProductFilter = "all";

const filterProducts = () => {
  const query = String(productSearch?.value || "").trim().toLowerCase();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const categories = String(card.dataset.category || "").split(" ");
    const searchText = `${card.dataset.search || ""} ${card.textContent || ""}`.toLowerCase();
    const matchesCategory = activeProductFilter === "all" || categories.includes(activeProductFilter);
    const matchesSearch = !query || searchText.includes(query);
    const isVisible = matchesCategory && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (productCount) productCount.textContent = `${visibleCount} ${visibleCount === 1 ? "product" : "products"}`;
  if (productEmpty) productEmpty.hidden = visibleCount !== 0;
};

productFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeProductFilter = button.dataset.filter || "all";
    productFilters.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    filterProducts();
  });
});

productSearch?.addEventListener("input", filterProducts);

document.querySelectorAll(".product-enquiry").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product || "a bicycle part";
    const message = `Hello Supreme Cycle, I want to enquire about ${product}. Please share available brands, sizes, wholesale quantity and current price.`;
    window.open(`https://wa.me/917888898988?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    formStatus.textContent = "Please add your name and choose a category.";
    return;
  }

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const interest = String(data.get("interest") || "").trim();
  const details = String(data.get("message") || "").trim();
  const lines = [
    `Hello Supreme Cycle, my name is ${name}.`,
    `I am looking for: ${interest}.`,
    details ? `Details: ${details}` : "Please share current options and prices."
  ];

  const whatsappNumber = interest === "Wholesale bicycle parts" ? "917888898988" : "919839850588";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  formStatus.textContent = "Opening WhatsApp…";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

const updateOpenStatus = () => {
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

  status.textContent = isFriday ? "Closed Friday" : isOpen ? "Open now" : "Closed now";
};

updateOpenStatus();
document.querySelector("#year").textContent = String(new Date().getFullYear());
