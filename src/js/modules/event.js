let DATA = {
  projects: [],
  upcoming: [],
  programs: [],
  archive: [],
};

let currentSlide = 0;
let archiveFilter = "all";

export async function initEvents() {
  try {
    const appData = await getAppData();

    // 1. Map JSON data to our local DATA object
    // Assuming your JSON has an "events_page" key or similar
    const source = appData.content || appData;

    DATA.projects = source.projects || [];
    DATA.upcoming = source.upcoming || [];
    DATA.programs = source.programs || [];
    DATA.archive = source.archive || [];

    // 2. Run your processing logic (moves completed items to archive)
    processData();

    // 3. Initial Render
    renderActiveCarousel();
    renderSections();

    // 4. Check for URL Parameters ---
    const hash = window.location.hash;
    if (hash && hash.startsWith("#project-")) {
      handleIncomingHash(hash);
    }

    // 5. Start Carousel Auto-play
    if (DATA.projects.length > 0) {
      setInterval(nextSlide, 8000);
    }
  } catch (error) {
    console.error("Error initializing events page:", error);
  }

  //checking URL function
  function handleIncomingHash(hash) {
    // Give the browser a tiny moment to paint the layout
    setTimeout(() => {
      const targetElement = document.querySelector(hash);
      if (!targetElement) return;

      // If it's in the carousel, move the carousel
      const projectId = parseInt(hash.replace("#project-", ""));
      const projectIndex = DATA.projects.findIndex((p) => p.id === projectId);

      if (projectIndex !== -1) {
        currentSlide = projectIndex;
        moveCarousel();
      }

      // Scroll to it
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300); // 300ms is usually enough for the DOM to be ready
  }

  //event delegation
  document.addEventListener("click", (e) => {
    // Find the closest element that was clicked with our specific target classes
    const target = e.target;

    // 1. Carousel Controls
    if (target.closest(".js-next-slide")) nextSlide();
    if (target.closest(".js-prev-slide")) prevSlide();

    // 2. Archive Filters
    const filterBtn = target.closest(".filter-btn");
    if (filterBtn) {
      const category = filterBtn.dataset.category;
      setArchiveFilter(category);
    }

    // 3. Open Drawer (Works for Carousel and Cards)
    const openBtn = target.closest('[data-action="open-drawer"]');
    if (openBtn) {
      const sectionId = openBtn.getAttribute("data-section");
      const itemId = parseInt(openBtn.getAttribute("data-id"));
      openDrawer(sectionId, itemId);
    }

    // 4. Close Drawer
    if (target.closest(".js-close-drawer") || target.id === "backdrop") {
      closeDrawer();
    }

    // 5. JumpTo (Nav links)
    const navLink = target.closest(".secnav-link");
    if (navLink) {
      const sectionId = navLink.getAttribute("data-jump");
      jumpTo(sectionId, navLink);
    }
  });

  //swiping support for carousel
  if (DATA.projects.length > 0) {
    setInterval(nextSlide, 8000);

    // --- SWIPE SUPPORT ---
    const track = document.getElementById("active-carousel-track");
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50; // Minimum distance to trigger swipe
        if (touchStartX - touchEndX > threshold) prevSlide(); // Swipe Left
        if (touchEndX - touchStartX > threshold) nextSlide(); // Swipe Right
    }
}
}

// --- OPTIMIZED DATA PROCESSING ---
function processData() {
  // 1. ACTIVE SECTION: Move logic (Remove from active, add to archive)
  const activeToRemove = DATA.projects.filter(
    (item) => item.status === "completed",
  );
  DATA.projects = DATA.projects.filter((item) => item.status !== "completed");

  activeToRemove.forEach((item) => {
    const archivedItem = { ...item, status: "completed", category: "projects" };
    // Prevent duplicate IDs in archive
    if (!DATA.archive.some((a) => a.id === archivedItem.id)) {
      DATA.archive.push(archivedItem);
    }
  });

  // 2. PROGRAMS SECTION: Pop-up logic (Stay in programs, ALSO appear in archive)
  DATA.programs.forEach((item) => {
    if (item.status === "completed") {
      const archiveCopy = { ...item, category: "programs" };
      // Prevent duplicate IDs in archive
      if (!DATA.archive.some((a) => a.id === archiveCopy.id)) {
        DATA.archive.push(archiveCopy);
      }
    }
  });
}

// 3. CAROUSEL FUNCTIONS
function renderActiveCarousel() {
  const track = document.getElementById("active-carousel-track");
  if (!track) return;

  if (DATA.projects.length === 0) {
    track.innerHTML = `<div class="p-20 text-center font-black uppercase opacity-20">No active projects at the moment</div>`;
    return;
  }

  track.innerHTML = DATA.projects
    .map(
      (item) => `
                <div id="project-${item.id}" class="carousel-slide bg-white flex flex-col md:flex-row h-full">
                    <div class="w-full md:w-1/2 h-64 md:h-[500px] relative overflow-hidden">
                        <img src="${item.img}" class="w-full h-full object-cover">
                        <div class="absolute top-4 left-4">
                            <div class="meta-group">
                                <span class="meta-label bg-blue-600 text-white">Type</span>
                                <span class="meta-value">${item.type}</span>
                            </div>
                        </div>
                    </div> 
                    <div class="w-full md:w-1/2 p-8 lg:px-12 flex flex-col justify-center border-t-4 md:border-t-0 md:border-l-4 border-black bg-white">
                        <p class="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-2">${item.subtitle}</p>
                        <h3 class="text-4xl xl:text-6xl font-black uppercase italic leading-none mb-6">${item.title}</h3>
                        
                        <div class="flex flex-wrap gap-3 mb-8">
                            <div class="meta-group">
                                <span class="meta-label bg-purple-400 text-white">Location</span>
                                <span class="meta-value">${item.location}</span>
                            </div>
                            <div class="meta-group">
                                <span class="meta-label bg-blue-400 text-white">Date</span>
                                <span class="meta-value">${item.date}</span>
                            </div>
                            <div class="meta-group">
                                <span class="meta-label bg-rose-400 text-white">Time</span>
                                <span class="meta-value">${item.time}</span>
                            </div>
                        </div>

                        <p class="text-lg font-medium text-zinc-600 mb-8 max-w-md">${item.description}</p>
                        
                        <button data-action="open-drawer" data-section="active" data-id="${item.id}" class="self-start px-8 py-4 bg-black text-white font-black uppercase italic text-sm hover:bg-blue-700 transition-colors">
                            View Project File
                        </button>
                    </div>
                </div>
            `,
    )
    .join("");
  moveCarousel();
}

function moveCarousel() {
  const track = document.getElementById("active-carousel-track");
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  if (DATA.projects.length > 0) {
    currentSlide = (currentSlide + 1) % DATA.projects.length;
    moveCarousel();
  }
}

function prevSlide() {
  if (DATA.projects.length > 0) {
    currentSlide =
      (currentSlide - 1 + DATA.projects.length) % DATA.projects.length;
    moveCarousel();
  }
}

// 4. SECTION & FILTER RENDERING
function setArchiveFilter(category) {
  archiveFilter = category;
  renderSections(); // This refreshes the UI
}

function renderSections() {
  const container = document.getElementById("sections-container");
  if (!container) return;
  container.innerHTML = "";

  const sectionConfigs = [
    {
      id: "upcoming",
      title: "Coming Up",
      highlight: "Next",
      bg: "bg-blue-600",
      text: "text-white",
    },
    {
      id: "programs",
      title: "Core",
      highlight: "Programs",
      bg: "bg-black",
      text: "text-white",
    },
    {
      id: "archive",
      title: "The",
      highlight: "Archive",
      bg: "bg-slate-100",
      text: "text-black",
    },
  ];

  sectionConfigs.forEach((conf) => {
    let items = [...DATA[conf.id]]; // Use a copy to prevent mutation during filtering

    // --- ADD THIS FALLBACK FOR UPCOMING ---
    if (conf.id === "upcoming" && (!items || items.length === 0)) {
      items = [
        {
          id: "fallback-001", // This must match the ID in generateCard
          title: "New Roadmap Incoming",
          subtitle: "Under Construction",
          description:
            "Our tech team is currently building the next wave of initiatives. Check back soon!",
          status: "Pending",
          // ...other properties (even if empty) to prevent errors
        },
      ];
    }
    // --------------------------------------

    let filterHTML = "";

    // Only add filter buttons if we are rendering the Archive section
    if (conf.id === "archive") {
      const categories = ["all", "projects", "programs", "events", "others"];
      filterHTML = `
                <div class="flex flex-wrap gap-3 mb-12 reveal-item">
                    ${categories
                      .map(
                        (cat) => `
                        <button data-category="${cat}" 
                            class="filter-btn ${archiveFilter === cat ? "active" : ""}">
                            ${cat}
                        </button>
                    `,
                      )
                      .join("")}
                </div>`;

      // Filter the archive items based on the button clicked
      if (archiveFilter !== "all") {
        const primaryCategories = ["projects", "programs", "events"];

        items = items.filter((item) => {
          if (archiveFilter === "others") {
            // If user clicks "others", show anything NOT in the primary list
            return !primaryCategories.includes(item.category.toLowerCase());
          } else {
            // Otherwise, do a standard match (projects, programs, or events)
            return item.category.toLowerCase() === archiveFilter;
          }
        });
      }
    }

    if (!items || (conf.id !== "archive" && items.length === 0)) return;

    const section = document.createElement("section");
    section.id = `sec-${conf.id}`;
    section.className = `py-24 ${conf.bg} ${conf.text} border-b-4 border-black`;

    section.innerHTML = `
            <div class="max-w-7xl mx-auto px-6">
                <div class="flex items-center gap-6 mb-16 reveal-item">
                    <h2 class="text-4xl md:text-6xl font-black uppercase italic">${conf.title} 
                        <span class="${conf.id === "upcoming" ? "text-black" : "text-blue-600"}">${conf.highlight}</span>
                    </h2>
                    <div class="h-1 flex-grow ${conf.id === "upcoming" ? "bg-white" : conf.id === "programs" ? "bg-amber-500" : "bg-black"}"></div>
                </div>
                
                ${filterHTML} <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${items.map((item) => generateCard(item, conf.id)).join("")}
                </div>
                
                ${conf.id === "archive" && items.length === 0 ? '<p class="italic font-bold">No items found in this category.</p>' : ""}
            </div>
        `;
    container.appendChild(section);
  });
  // DO THIS RIGHT AFTER:
  if (typeof initGlobalReveal === "function") initGlobalReveal();
}

function generateCard(item, sectionId) {
  // Check if this is the "Stay Tuned" fallback card
  if (item.id === "fallback-001") {
    return `
            <div class="card-container group">
                <div class="card-inner h-full bg-blue-50 text-black border-4 border-dashed border-blue-600 p-8 flex flex-col items-center justify-center text-center min-h-[450px]">
                    <div class="w-16 h-16 bg-blue-600 flex items-center justify-center rotate-12 shadow-brutal-sm mb-6 group-hover:rotate-0 transition-transform duration-300">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>

                    <h3 class="text-3xl font-black uppercase italic leading-tight mb-2">${item.title}</h3>
                    <p class="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">${item.subtitle}</p>
                    
                    <p class="text-zinc-600 font-medium max-w-[280px] mb-8">
                        ${item.description}
                    </p>

                    <button onclick="router.navigate('contact')" 
                        class="w-full py-4 bg-white border-3 border-black font-black uppercase italic text-sm shadow-brutal-sm hover:bg-black hover:text-white hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(30,64,175,1)] transition-all">
                        Keep in touch [→]
                    </button>

                    <div class="mt-6 font-mono text-[9px] font-black uppercase text-blue-400 tracking-tighter">
                        Status: Awaiting Roadmap Approval
                    </div>
                </div>
            </div>
        `;
  }
  return `
                <div id="project-${item.id}" class="card-container group cursor-pointer reveal-item" data-action="open-drawer" data-section="${sectionId}" data-id="${item.id}">
                    <div class="card-inner h-full bg-white text-black brutal-border p-4 flex flex-col ">
                        <div class="relative mb-4 overflow-hidden brutal-border h-48 bg-zinc-100">
                            <img src="${item.img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-2 left-2">
                                <div class="meta-group">
                                    <span class="meta-label bg-blue-600 text-white">Type</span>
                                    <span class="meta-value">${item.type}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex-grow">
                            <h3 class="text-2xl font-black uppercase leading-tight mb-1">${item.title}</h3>
                            <p class="text-[10px] font-black text-zinc-400 uppercase mb-4 tracking-widest">${item.subtitle}</p>
                            
                            <div class="flex flex-wrap gap-2 mb-4">
                                <div class="meta-group">
                                    <span class="meta-label bg-purple-400 text-white">Place</span>
                                    <span class="meta-value">${item.location}</span>
                                </div>
                                <div class="meta-group">
                                    <span class="meta-label bg-blue-400 text-white">Date</span>
                                    <span class="meta-value">${item.date}</span>
                                </div>
                                <div class="meta-group">
                                    <span class="meta-label bg-rose-400 text-white">Time</span>
                                    <span class="meta-value">${item.time}</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t-2 border-black flex items-center justify-between">
                            <span class="font-mono text-sm font-black text-amber-500">${item.status}</span>
                            <span class="font-black text-xs uppercase group-hover:text-blue-700 transition-colors">Open File →</span>
                        </div>
                    </div>
                </div>
            `;
}

// 5. DRAWER & UTILITIES LOGIC
function openDrawer(sectionId, id) {
  // Search all possible arrays for the item
  const allItems = [
    ...DATA.projects,
    ...DATA.programs,
    ...DATA.upcoming,
    ...DATA.archive,
  ];
  const item = allItems.find((d) => d.id === id);
  if (!item) return;

  // Logic for the Action Button
  let actionButtonHTML = "";

  if (item.status === "active") {
    actionButtonHTML = `
            <div class="space-y-4">
                <a href="${item.link}" target="_blank" class="block w-full bg-blue-700 text-white p-5 font-black text-center uppercase text-lg border-3 border-black brutal-shadow hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-brutal-md transition-all duration-200 active:translate-y-[2px] active:shadow-none">
                    Register Now [→]
                </a>
            </div>`;
  } else {
    // If completed, maybe just show a "Closed" badge or nothing
    actionButtonHTML = `
            <div class="p-4 border-2 border-dashed border-zinc-400 text-zinc-400 font-black uppercase text-center italic">
                Registration Closed / Project Complete
            </div>`;
  }

  const content = document.getElementById("drawer-content");

  content.innerHTML = `
       <div class="relative h-64 bg-black overflow-hidden border-b-4 border-black">
        <img src="${item.img}" class="w-full h-full object-cover opacity-50 ">
        
        <button class="js-close-drawer absolute top-4 right-4 z-50 bg-white border-2 border-black p-2 shadow-brutal-sm hover:bg-red-500 hover:text-white transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="size-6">
                <path d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div class="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
            <div class="meta-group mb-2 inline-flex shadow-brutal-sm">
                <span class="meta-label bg-emerald-400 text-black text-[10px]">STATUS</span>
                <span class="meta-value bg-white text-black text-[10px]">${item.status.toUpperCase()}</span>
            </div>
            <h2 class="text-3xl md:text-4xl font-black text-white uppercase italic leading-none tracking-tighter">
                ${item.title}
            </h2>
        </div>
    </div>

    <div class="p-6 bg-white">
        <div class="flex flex-col gap-3 mb-8">
            <div class="bg-yellow-300 p-4 border-2 border-black shadow-brutal-sm rotate-[-1deg]">
                <span class="block text-[9px] font-black uppercase mb-1 opacity-60">Field Location</span>
                <span class="text-xl font-black uppercase italic">${item.location}</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div class="bg-blue-600 p-4 border-2 border-black shadow-brutal-sm rotate-[1deg] text-white">
                    <span class="block text-[9px] font-black uppercase mb-1 opacity-80">Timeline</span>
                    <span class="font-black uppercase text-sm">${item.time}</span>
                </div>
                <div class="bg-white p-4 border-2 border-black shadow-brutal-sm rotate-[-1deg]">
                    <span class="block text-[9px] font-black uppercase mb-1 opacity-60">Calendar Date</span>
                    <span class="font-black uppercase text-sm">${item.date}</span>
                </div>
            </div>
        </div>

        <div class="mb-8 border-l-4 border-blue-600 pl-4">
            <h4 class="font-black uppercase text-xs mb-2 tracking-widest text-zinc-400">Executive Summary //</h4>
            <p class="text-md text-black leading-tight font-bold italic uppercase">
                ${item.description}
            </p>
        </div>

        <div class="mt-auto">
            ${actionButtonHTML}
        </div>
        
        <div class="mt-8 pt-4 border-t-2 border-dashed border-zinc-200 flex justify-between items-center opacity-50">
            <span class="font-mono text-[9px] font-black uppercase">Ref_ID: ${item.id}</span>
            <span class="font-mono text-[9px] font-black uppercase">InnoTech_Auth_Verified</span>
        </div>
    </div>
    `;

  document.getElementById("drawer").classList.add("open");
  document.getElementById("backdrop").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("backdrop").classList.add("hidden");

  // REVERSE BOTH HERE
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

// 6. INITIALIZATION & SCROLL
document.addEventListener("DOMContentLoaded", initEvents);

//section Navbar
function jumpTo(id, btn) {
  const el = document.getElementById("sec-" + id);
  if (el) {
    // Offset: Fixed Nav (80) + Sticky Nav (60) = 140
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // Manual UI update
  document
    .querySelectorAll(".secnav-link")
    .forEach((link) => link.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

// This will highlight the nav buttons as you scroll manually
window.addEventListener("scroll", () => {
  const sections = ["projects", "upcoming", "programs", "archive"];
  let current = "";

  sections.forEach((id) => {
    const section = document.getElementById("sec-" + id);
    if (section) {
      const rect = section.getBoundingClientRect();
      // If the top of the section is near the top of the viewport
      if (rect.top <= 160) {
        current = id;
      }
    }
  });

  // Update Nav Buttons
  document.querySelectorAll(".secnav-link").forEach((btn) => {
    btn.classList.remove("active");

    // FIX: Look at the data-jump attribute instead of onclick
    const jumpTarget = btn.getAttribute("data-jump");

    if (current && jumpTarget === current) {
      btn.classList.add("active");
      btn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  });
});
