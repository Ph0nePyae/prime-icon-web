// MAIN INIT FUNCTION
export async function initIndex() {
    // 1. Load the projects
    await loadProjects();
    
    // 2. Load the AI Image
    await loadAIImage();
}

async function loadProjects() {
  const track = document.getElementById("projects-track");
  if (!track) return;

  // Fetch the actual project data from your JSON
  const data = await getAppData();
  const projects = data.content.projects; // Use your actual JSON path

  track.innerHTML = projects
    .map(
      (project) => `
        <div class="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 py-4">
            <div class="bg-white hover-lift h-full group">
                <div class="bg-gray-900 text-white p-2 font-black text-[10px] flex justify-start">
                    <span class="bg-blue-600 text-white px-2 py-1 font-display uppercase italic">
                        ${project.status}
                    </span>
                </div>
                
                <div class="h-48 overflow-hidden bg-gray-200">
                    <img src="${project.img}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                </div>

                <div class="px-6 pt-6">
                    <h3 class="text-xl font-black mb-2 uppercase italic">${project.title}</h3>
                    <p class="text-gray-600 mb-4 text-sm line-clamp-2">${project.description}</p>
                    
                    <a href="event.html#project-${project.id}" 
                       class="block w-full text-center py-3 bg-black text-white font-black uppercase italic text-xs hover:bg-blue-700 transition-all">
                        Learn More [→]
                    </a>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  initCarousel("projects", 3);
}

// Your existing Carousel Logic
function initCarousel(name, desktopVisible) {
  const track = document.getElementById(`${name}-track`);
  const prevBtn = document.getElementById(`${name}-prev`);
  const nextBtn = document.getElementById(`${name}-next`);
  const indicatorsContainer = document.getElementById(`${name}-indicators`);

  if (!track || !prevBtn || !nextBtn) return;

  const items = track.children;
  let currentIndex = 0;
  let startX = 0;

  const getVisibleItems = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return desktopVisible;
  };

  const getMaxIndex = () => Math.max(0, items.length - getVisibleItems());

  function createIndicators() {
    if (!indicatorsContainer) return;
    indicatorsContainer.innerHTML = "";
    for (let i = 0; i <= getMaxIndex(); i++) {
      const dot = document.createElement("button");
      dot.className =
        "w-3 h-3 border-2 border-white transition-all duration-300 rounded-full";
      dot.onclick = () => {
        currentIndex = i;
        render();
      };
      indicatorsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!indicatorsContainer) return;
    const dots = indicatorsContainer.querySelectorAll("button");
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add("bg-primary", "scale-125");
      } else {
        dot.classList.remove("bg-primary", "scale-125");
      }
    });
  }

  function render() {
    const max = getMaxIndex();
    if (currentIndex > max) currentIndex = max;
    const offset = -(currentIndex * (100 / getVisibleItems()));
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  const handleNext = () => {
    currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
    render();
  };

  const handlePrev = () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
    render();
  };

  nextBtn.addEventListener("click", handleNext);
  prevBtn.addEventListener("click", handlePrev);

  track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), {
    passive: true,
  });
  track.addEventListener(
    "touchend",
    (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev();
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    createIndicators();
    render();
  });

  createIndicators();
  render();
}

// Async Image Loader
async function loadAIImage() {
  const apiKey = ""; // Runtime provided
  const promptText =
    "A high-tech architectural blueprint of a community center combined with organic human silhouettes, minimalist brutalist style, dominated by deep blue and white lines, technical grid background, clean and professional NGO aesthetic.";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: { prompt: promptText },
          parameters: { sampleCount: 1 },
        }),
      },
    );
    const result = await response.json();
    if (result.predictions && result.predictions[0]) {
      document.getElementById("hero-img").src =
        `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
    }
  } catch (err) {
    console.error("Image generation failed, using fallback.");
  }
}
