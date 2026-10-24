"use strict";
const HEROES = [
  { id: "phil", name: "Phil Coulson", role: "S.H.I.E.L.D. Field Leader", image: "Phil", hp: 80, stamina: 80, attack: 30, accuracy: 30, defense: 15, evasion: 15, description: "A versatile leader with ranged attacks and an all-team damage boost." },
  { id: "bruiser", name: "S.H.I.E.L.D. Bruiser", role: "Heavy Frontline Fighter", image: "Bruiser", hp: 120, stamina: 80, attack: 18, accuracy: 20, defense: 35, evasion: 20, description: "A durable frontline fighter with area damage and protective abilities." },
  { id: "blackwidow", name: "Black Widow", role: "Elite Covert Operative", image: "Black Widow", hp: 100, stamina: 100, attack: 25, accuracy: 20, defense: 20, evasion: 25, description: "A fast, evasive attacker with strong single-target moves and debuffs." },
  { id: "beta-ray-bill", name: "Beta Ray Bill", role: "Korbinite Champion", image: "Bill", hp: 78.68, stamina: 71.53, attack: 15.74, accuracy: 12.88, defense: 15.74, evasion: 11.44, description: "A mighty warrior wielding Stormbreaker, with devastating attacks and stunning lightning." }
];
const STORAGE_KEY = "avengersAllianceSelectedHeroes";
const selected = new Set(HEROES.slice(0, 3).map(hero => hero.id));
const grid = document.getElementById("characterGrid");
const count = document.getElementById("selectionCount");
const error = document.getElementById("selectionError");
const startButton = document.getElementById("startBattleBtn");
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  if (Array.isArray(saved)) {
    selected.clear();
    saved.filter(id => HEROES.some(hero => hero.id === id)).forEach(id => selected.add(id));
    if (selected.size === 0) HEROES.slice(0, 3).forEach(hero => selected.add(hero.id));
    while (selected.size > 3) selected.delete([...selected].at(-1));
  }
} catch (_) {}
function loadPortrait(img, name) {
  const extensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  let attempt = 0;
  img.onerror = () => {
    if (attempt >= extensions.length) {
      img.style.display = "none";
      img.parentElement.classList.add("portrait-missing");
      return;
    }
    img.src = "assets/" + encodeURIComponent(name) + extensions[attempt++];
  };
  img.src = "assets/" + encodeURIComponent(name) + extensions[attempt++];
}
function render() {
  grid.innerHTML = "";
  HEROES.forEach(hero => {
    const isSelected = selected.has(hero.id);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "character-card" + (isSelected ? " selected" : "");
    card.setAttribute("aria-pressed", String(isSelected));
    card.setAttribute("aria-label", hero.name + ", " + (isSelected ? "selected" : "not selected"));
    const art = document.createElement("div");
    art.className = "character-art";
    const img = document.createElement("img");
    img.alt = hero.name;
    loadPortrait(img, hero.image);
    art.appendChild(img);
    const content = document.createElement("div");
    content.className = "character-content";
    const name = document.createElement("h3");
    name.textContent = hero.name;
    const role = document.createElement("p");
    role.className = "character-role";
    role.textContent = hero.role;
    const description = document.createElement("p");
    description.className = "character-description";
    description.textContent = hero.description;
    const stats = document.createElement("div");
    stats.className = "character-stats";
    [["HP",hero.hp],["STA",hero.stamina],["ATK",hero.attack],["ACC",hero.accuracy],["DEF",hero.defense],["EVA",hero.evasion]].forEach(([label,value]) => {
      const item = document.createElement("span");
      const small = document.createElement("small");
      small.textContent = label;
      const b = document.createElement("b");
      b.textContent = Math.ceil(value);
      item.append(small,b);
      stats.appendChild(item);
    });
    const badge = document.createElement("span");
    badge.className = "selection-badge";
    badge.textContent = isSelected ? "SELECTED ✓" : "ADD TO TEAM +";
    content.append(name, role, description, stats, badge);
    card.append(art, content);
    card.addEventListener("click", () => {
      error.textContent = "";
      if (selected.has(hero.id)) {
        if (selected.size === 1) { error.textContent = "Select at least one hero to begin."; return; }
        selected.delete(hero.id);
      } else {
        if (selected.size >= 3) { error.textContent = "Your squad is full. Deselect a hero first."; return; }
        selected.add(hero.id);
      }
      render();
    });
    grid.appendChild(card);
  });
  count.textContent = selected.size + " / 3 selected";
  startButton.disabled = selected.size === 0;
}
document.getElementById("selectAllBtn").addEventListener("click", () => {
  selected.clear();
  HEROES.slice(0, 3).forEach(hero => selected.add(hero.id));
  error.textContent = "";
  render();
});
startButton.addEventListener("click", () => {
  if (selected.size === 0) { error.textContent = "Select at least one hero to begin."; return; }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(HEROES.filter(hero => selected.has(hero.id)).map(hero => hero.id)));
  window.location.href = "battle/";
});
render();
