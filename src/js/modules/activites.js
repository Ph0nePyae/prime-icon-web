// --- Logic Configuration ---
const CONFIG = {
  holeSpacing: 50,
  decorCount: 15,
  parallaxSpeed: 0.05,
};

// --- Core Functions ---
const updateFilmStrip = () => {
  const strip = document.getElementById("filmStrip");
  if (!strip) return;

  const count = Math.floor(window.innerWidth / CONFIG.holeSpacing);
  strip.innerHTML = Array(count).fill('<div class="film-hole"></div>').join("");
};

const addDecor = () => {
  document.querySelectorAll(".bg-symbol").forEach((el) => el.remove());
  const symbols = ["★", "PRIME", "2026", "IMPACT", "♥", "ICON"];
  const fragment = document.createDocumentFragment();
  const height = document.documentElement.scrollHeight || 2000;

  for (let i = 0; i < CONFIG.decorCount; i++) {
    const decor = document.createElement("div");
    decor.className =
      "bg-symbol absolute font-handwritten text-zinc-300 pointer-events-none select-none opacity-20";
    const size = Math.random() * 1 + 1;

    decor.style.cssText = `
                left: ${Math.random() * 80}vw;
                top: ${Math.random() * (height - 200)}px;
                transform: rotate(${Math.random() * 40 - 20}deg);
                font-size: ${size}rem;
                z-index: -1;
            `;
    decor.innerText = symbols[i % symbols.length];
    fragment.appendChild(decor);
  }
  document.body.appendChild(fragment);
};

export async function initActivities() {
  // 1. Setup UI Decor immediately
  updateFilmStrip();

  try {
    const data = await getAppData();
    const moments = data?.activity_log?.moments || [];
    const board = document.getElementById("board");

    // 2. Build DOM in memory (Fastest)
    board.innerHTML = moments
      .map((m, i) => {
        const rot = m.rotation || Math.random() * 6 - 3;
        const isEven = i % 2 === 0;
        const stickySide = i % 4 === 0 ? "left: -15px" : "right: -15px";

        return `
                    <article class="moment reveal-item" style="--rotation: ${rot}deg">
                        <div class="absolute top-[-8px] right-[25%] w-10 h-3 bg-zinc-800/80 z-20"></div>
                        <img src="${m.img}" alt="${m.title}" loading="lazy">
                        <div class="caption">${m.title}</div>
                        ${
                          isEven
                            ? `
                            <div class="sticky-note" style="top: -40px; ${stickySide}; transform: rotate(${-rot * 1.2}deg)">
                                ${m.note}
                            </div>
                        `
                            : ""
                        }
                    </article>
                `;
      })
      .join("");

    // 3. Post-render UI
    addDecor();
    initRevealObserver();
  } catch (err) {
    console.error("Activity Load Error:", err);
  }
}

// --- Performance Listeners ---
let resizeTask;
window.addEventListener("resize", () => {
  clearTimeout(resizeTask);
  resizeTask = setTimeout(() => {
    updateFilmStrip();
    addDecor();
  }, 200);
});

// --- The Reveal Logic ---
const initRevealObserver = () => {
  const options = {
    threshold: 0.15, // Trigger when 15% of the card is visible
    rootMargin: "0px 0px -50px 0px", // Trigger slightly before it hits the viewport
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add class to trigger CSS transition
        entry.target.classList.add("is-visible");
        // Optional: Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll(".moment").forEach((el) => observer.observe(el));
};

// RequestAnimationFrame for Parallax (Smooth)
window.addEventListener("scroll", () => {
  if (window.innerWidth < 768) return;

  window.requestAnimationFrame(() => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll(".moment.is-visible").forEach((el, i) => {
      const factor = ((i % 3) + 1) * CONFIG.parallaxSpeed;
      // Only apply a small Y shift so it doesn't break the layout
      el.style.setProperty("--y-offset", `${-(scrolled * factor) * 0.2}px`);
    });
  });
});

document.addEventListener("DOMContentLoaded", initActivities);
