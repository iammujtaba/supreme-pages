const galleryItems = [...document.querySelectorAll("[data-gallery-item]")];
const galleryDialog = document.querySelector("#gallery-lightbox");
const lightboxImage = galleryDialog?.querySelector("figure img");
const lightboxCaption = galleryDialog?.querySelector("[data-lightbox-caption]");
const lightboxCounter = galleryDialog?.querySelector("[data-lightbox-counter]");
const closeButton = galleryDialog?.querySelector("[data-lightbox-close]");
const previousButton = galleryDialog?.querySelector("[data-lightbox-previous]");
const nextButton = galleryDialog?.querySelector("[data-lightbox-next]");

let currentIndex = 0;
let lastTrigger = null;

const updateLightbox = (index) => {
  if (!galleryItems.length || !lightboxImage || !lightboxCaption || !lightboxCounter) return;

  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];
  const image = item.querySelector("img");

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = item.dataset.caption || image.alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
};

const openLightbox = (index, trigger) => {
  if (!galleryDialog) return;

  lastTrigger = trigger;
  updateLightbox(index);
  document.body.classList.add("lightbox-open");

  if (typeof galleryDialog.showModal === "function") galleryDialog.showModal();
  else galleryDialog.setAttribute("open", "");
  closeButton?.focus();
};

const closeLightbox = () => {
  if (!galleryDialog?.open) return;

  if (typeof galleryDialog.close === "function") galleryDialog.close();
  else galleryDialog.removeAttribute("open");
};

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index, item));
});

closeButton?.addEventListener("click", closeLightbox);
previousButton?.addEventListener("click", () => updateLightbox(currentIndex - 1));
nextButton?.addEventListener("click", () => updateLightbox(currentIndex + 1));

galleryDialog?.addEventListener("click", (event) => {
  if (event.target === galleryDialog) closeLightbox();
});

galleryDialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLightbox();
});

galleryDialog?.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  lastTrigger?.focus();
});

document.addEventListener("keydown", (event) => {
  if (!galleryDialog?.open) return;
  if (event.key === "ArrowLeft") updateLightbox(currentIndex - 1);
  if (event.key === "ArrowRight") updateLightbox(currentIndex + 1);
});
