window.toggleMobileMenu = function () {
  document.getElementById("mobile-menu").classList.toggle("translate-x-full");
};

// Add to main.js - One observer to rule them all
function initGlobalReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Efficiency: stop watching once revealed
        }
      });
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(".reveal-item")
    .forEach((el) => observer.observe(el));
}
window.addEventListener("DOMContentLoaded", initGlobalReveal);

// SAFE ANIMATION BOOTUP
window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("intro-overlay");

  // ONLY run animation logic if the overlay actually exists in the HTML
  if (overlay) {
    const text = document.getElementById("intro-text");
    const line = document.getElementById("intro-line");

    setTimeout(() => text?.classList.remove("translate-y-full"), 400);
    setTimeout(() => {
      if (line) line.style.width = "300px";
    }, 900);

    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.style.display = "none";
        initGlobalReveal();
      }, 800);
    }, 2800);
  } else {
    // If intro is commented out, just run the reveal logic immediately
    initGlobalReveal();
  }
});


// --- GLOBAL DATA STORE ---
// This function caches the data so if it's called twice, it doesn't download again.
let cachedData = null;

async function getAppData() {
    if (cachedData) return cachedData; // Return if already downloaded    
    try {
        const response = await fetch('./js/data.json');
        if (!response.ok) throw new Error("Data not found");
        cachedData = await response.json();
        return cachedData;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}
