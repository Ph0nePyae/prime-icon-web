const createRoleCard = (role, isDark, titleColor, btnHover) => `
    <div class="${isDark ? "role-card-dark" : "role-card"} p-6 bg-white text-black flex flex-col justify-between h-full">
        <div>
            <h4 class="font-black ${titleColor} uppercase text-sm mb-2 tracking-widest">${role.title}</h4>
            <p class="text-xs font-bold mb-6 text-zinc-500 leading-relaxed">${role.task}</p>
        </div>
        <a href="${role.link}" class="w-full py-3 bg-black text-white font-black text-[10px] uppercase text-center ${btnHover} transition-all active:scale-95">
            Apply Position →
        </a>
    </div>
`;

const createPlaceholder = () => `
    <div class="py-12 border-4 border-dashed border-current border-opacity-20 text-center flex items-center justify-center w-full">
        <p class="font-black uppercase text-[10px] opacity-40 tracking-[0.4em] italic">No active roles in this squad</p>
    </div>
`;

const createDepartmentHTML = (dept, index) => {
  const isEven = index % 2 === 0;
  // STRICT COLOR LOGIC
  // Only InnoTech (bg-black) gets the white border treatment
  const isBlackBg = dept.bg === "bg-black";
  const borderClass = isBlackBg ? "border-lime-400" : "border-black";

  // Shadow Logic: Use the shadow defined in the data,
  // or fall back to white ONLY for black backgrounds.
  const shadowClass = dept.shadow
    ? dept.shadow
    : isBlackBg
      ? "brutal-shadow-lime"
      : "brutal-shadow-black";

  //theme
  const theme = {
    roleTitle: isBlackBg ? "text-lime-600" : "text-blue-600",
    // Make sure these classes exist in your CSS!
    cardShadow: isBlackBg
      ? "brutal-shadow-lime"
      : dept.shadow || "brutal-shadow-black",
    border: isBlackBg ? "border-lime-400" : "border-black",
    btnHover: isBlackBg
      ? "hover:bg-lime-500 hover:text-black"
      : "hover:bg-blue-600 hover:text-white",
  };

  // Logic: If there are teams, map them. If no teams but direct roles exist, treat as one "Direct Opportunity" team.
  const contentData =
    dept.teams.length > 0
      ? dept.teams
      : dept.roles?.length > 0
        ? [
            {
              name: "Direct Opportunities",
              about: dept.mission,
              isRecruiting: true,
              roles: dept.roles,
            },
          ]
        : [];

  return `
        <section class="${dept.bg} ${dept.textColor} py-24 md:py-40 border-b-[3px] border-black overflow-hidden relative reveal-item">
            <div class="max-w-7xl mx-auto px-6">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                    
                    <div class="reveal-item lg:col-span-5 ${!isEven ? "lg:order-last" : ""}">
                        <div class="sticky-sidebar">
                            <div class="section-label mb-6">${dept.label} // ${dept.id}</div>
                            <h2 class="${dept.accentColor} font-display text-4xl md:text-6xl font-black uppercase italic leading-none tracking-tighter mb-8">
                                ${dept.name} <br>
                                <span class="text-black">${dept.accentName || ""}</span>
                            </h2>
                            <div class="aspect-video w-full brutal-border ${borderClass} mb-8 overflow-hidden group">
                                <img src="${dept.image}" alt="${dept.name}" class="w-full h-full object-cover md:grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700">
                            </div>
                            <div class="mb-10 reveal-item delay-200">
                                <h4 class="text-xs font-black uppercase tracking-widest mb-4 opacity-50 underline decoration-2">Core Mission</h4>
                                <p class="text-xl md:text-2xl font-bold leading-tight italic">"${dept.mission}"</p>
                            </div>
                            <div class="reveal-item">
                                <h4 class="text-xs font-black uppercase tracking-widest mb-4 opacity-50 underline decoration-2">Key Focus Areas</h4>
                                <ul class="space-y-2 font-bold text-sm md:text-base uppercase tracking-tight">
                                    ${dept.tasks.map((t) => `<li class="flex items-center gap-3"><span class="w-2 h-2 ${dept.lineColor}"></span> ${t}</li>`).join("")}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-7 flex flex-col gap-10 reveal-item delay-200">
                        ${
                          contentData.length > 0
                            ? contentData
                                .map(
                                  (team) => `
                            <div class="p-8 brutal-border ${borderClass} ${shadowClass} bg-white/5 backdrop-blur-sm reveal-item delay-300">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                    <h3 class="${dept.accentColor} text-3xl md:text-4xl font-black uppercase italic">${team.name}</h3>
                                    ${
                                      team.isRecruiting
                                        ? '<span class="status-badge status-open">OPEN SEATS</span>'
                                        : '<span class="status-badge status-closed">Standby</span>'
                                    }
                                </div>
                                <p class="font-bold text-lg opacity-70 mb-10 border-l-4 border-current pl-6 italic">${team.about}</p>
                                
                                ${
                                  team.isRecruiting && team.roles?.length > 0
                                    ? `
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        ${team.roles.map((role) => createRoleCard(role, isBlackBg, theme.roleTitle, theme.btnHover)).join("")}
                                    </div>
                                `
                                    : createPlaceholder()
                                }
                            </div>
                        `,
                                )
                                .join("")
                            : createPlaceholder()
                        }
                    </div>

                </div>
            </div>
        </section>
    `;
};

let departments = [];
export async function initDepartments() {
  try {
    const data = await getAppData();
    if (!data || !data.departments) return;

    const departments = data.departments;
    const root = document.getElementById("departments-root");

    if (!root) return;

    // 2. Inject the HTML
    root.innerHTML = departments.map(createDepartmentHTML).join("");
    // 2. TRIGGER THE REVEAL HERE
    // Since the items now exist in the DOM, we run the observer again
    if (typeof initGlobalReveal === "function") {
      initGlobalReveal();
    }
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", initDepartments);
