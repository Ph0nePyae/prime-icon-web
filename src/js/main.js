import {renderFooter} from '../components/footer.js';

// --- MOBILE MENU ---
window.toggleMobileMenu = function () {
  document.getElementById("mobile-menu").classList.toggle("translate-x-full");
};

// --- GLOBAL REVEAL ANIMATION ---
window.initGlobalReveal = function() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); 
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal-item").forEach((el) => observer.observe(el));
}

// --- BOOTUP & COMPONENT LOADING ---
window.addEventListener("DOMContentLoaded", () => {
  renderFooter();
  
  const overlay = document.getElementById("intro-overlay");

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
    initGlobalReveal();
  }
});

// --- GLOBAL DATA STORE ---
let cachedData = null;

window.getAppData = async function getAppData() {
    if (cachedData) return cachedData;    
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

