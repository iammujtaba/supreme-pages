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
