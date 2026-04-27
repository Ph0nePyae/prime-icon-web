// --- Memory Stack Auto-Shuffle ---
const stack = document.getElementById("memoryStack");
let cards = Array.from(stack.querySelectorAll(".memory-card"));

function shuffle() {
  const topCard = cards[0];
  topCard.classList.add("shuffle-out");

  setTimeout(() => {
    cards.shift();
    cards.push(topCard);

    cards.forEach((card, index) => {
      card.classList.remove(
        "card-0",
        "card-1",
        "card-2",
        "card-hidden",
        "shuffle-out",
      );
      if (index === 0) card.classList.add("card-0");
      else if (index === 1) card.classList.add("card-1");
      else if (index === 2) card.classList.add("card-2");
      else card.classList.add("card-hidden");
    });
  }, 350);
}

setInterval(shuffle, 4500);

// --- Team Grid Population ---
let currentTeam = [];

export async function init() {
  const data = await getAppData(); // One simple line to get data
  if (!data || !data.teamData) return;

  currentTeam = data.teamData;
  const grid = document.getElementById("teamGrid");

  grid.innerHTML = currentTeam
    .map(
      (member, index) => `
                <div class="grid-cell" data-member-index="${index}">
                    <div class="image-container">
                        <img src="${member.img}" alt="${member.name}">
                    </div>
                    <div class="cell-info-bar">
                        <div class="flex flex-col">
                            <span class="role-badge font-display italic">${member.role}</span>
                            <span class="font-black text-[10px] md:text-xs uppercase leading-tight text-white">${member.name}</span>
                        </div>
                    </div>
                </div>
            `,
    )
    .join("");

  // replacement of onclick
  document.addEventListener("click", (e) => {
    const cell = e.target.closest(".grid-cell");
    //open member
    if (cell) {
      const index = cell.getAttribute("data-member-index");
      openMember(index);
      return;
    }
    //close member
    if (e.target.closest(".js-close-member") || e.target.id === "backdrop") {
      closeMember();
    }
  });
}

function openMember(index) {
  const member = currentTeam[index];
  const content = document.getElementById("panelContent");

  content.innerHTML = `
                <div class="blueprint-header">
                    <span class="blueprint-role italic">PROFILE</span>
                    <h2 class="blueprint-name font-display">${member.name}</h2>
                    <span class="font-mono text-xs md:text-lg uppercase font-bold text-blue-400 mt-2 block">${member.role}</span>
                </div>
                <div class="blueprint-body">
                    <div class="blueprint-portrait">
                        <img src="${member.img}" alt="${member.name}">
                    </div>
                    <div class="blueprint-text">
                        <p class="mb-8 font-mono text-[10px] uppercase text-zinc-600 tracking-[0.4em]">About</p>
                        <p class="mb-10 font-normal leading-relaxed text-zinc-300">${member.bio}</p>
                        <div class="grid grid-cols-2 gap-8 border-y border-zinc-900 py-10">
                            <div>
                                <span class="block font-mono text-[10px] text-zinc-600 uppercase mb-1">Functional Focus</span>
                                <span class="font-bold uppercase text-sm tracking-widest text-white">${member.focus}</span>
                            </div>
                            <div>
                                <span class="block font-mono text-[10px] text-zinc-600 uppercase mb-1">Operational Tenure</span>
                                <span class="font-bold uppercase text-sm tracking-widest text-white">${member.tenure}</span>
                            </div>
                        </div>
                        <div class="mt-12 flex flex-col sm:flex-row gap-4">
                            <a href="#" class="border border-zinc-800 text-white px-8 py-4 text-base uppercase font-bold text-center hover:bg-blue-500 transition-all">LinkedIn</a>
                        </div>
                    </div>
                </div>
            `;

  document.getElementById("detailPanel").classList.add("is-open");
  document.getElementById("backdrop").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMember() {
  document.getElementById("detailPanel").classList.remove("is-open");
  document.getElementById("backdrop").classList.remove("active");
  document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", init);
