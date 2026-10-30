"use strict";
const HEROES = [
  { id: "phil", name: "Phil Coulson", role: "S.H.I.E.L.D. Field Leader", image: "Phil", hp: 80, stamina: 80, attack: 30, accuracy: 30, defense: 15, evasion: 15, description: "A versatile leader with ranged attacks and an all-team damage boost." },
  { id: "bruiser", name: "S.H.I.E.L.D. Bruiser", role: "Heavy Frontline Fighter", image: "Bruiser", hp: 120, stamina: 80, attack: 18, accuracy: 20, defense: 35, evasion: 20, description: "A durable frontline fighter with area damage and protective abilities." },
  { id: "blackwidow", name: "Black Widow", role: "Elite Covert Operative", image: "Black Widow", hp: 100, stamina: 100, attack: 25, accuracy: 20, defense: 20, evasion: 25, description: "A fast, evasive attacker with strong single-target moves and debuffs." },
  { id: "beta-ray-bill", name: "Beta Ray Bill", role: "Korbinite Champion", image: "Bill", hp: 7868, stamina: 7153, attack: 1574, accuracy: 1288, defense: 1574, evasion: 1144, description: "A mighty warrior wielding Stormbreaker, with devastating attacks and stunning lightning." },
  { id: "blackcat", name: "Black Cat", role: "Master Thief", image: "Black Cat", hp: 100, stamina: 100, attack: 20, accuracy: 20, defense: 21, evasion: 91, description: "A nimble thief who can steal buffs and turn luck in her favor." },
  { id: "elektra", name: "Elektra", role: "Assassin", image: "Elektra", hp: 110, stamina: 100, attack: 27, accuracy: 23, defense: 26, evasion: 80, description: "A deadly assassin with bleeding attacks and stealth." },
  { id: "hawkeye", name: "Hawkeye", role: "Expert Archer", image: "Hawkeye", hp: 90, stamina: 110, attack: 30, accuracy: 35, defense: 19, evasion: 72, description: "A precise archer with trick arrows and area attacks." },
  { id: "antman", name: "Ant-Man", role: "Pym Particle Hero", image: "Ant-Man", hp: 148, stamina: 148, attack: 33, accuracy: 34, defense: 37, evasion: 82, description: "Uses Pym particles to strike, swarm, and shrink from danger." },
  { id: "daredevil", name: "Daredevil", role: "The Man Without Fear", image: "Daredevil", hp: 158, stamina: 158, attack: 31, accuracy: 36, defense: 42, evasion: 87, description: "A skilled close-combat fighter with heightened radar senses." },
  { id: "howard", name: "Howard the Duck", role: "Duck Detective", image: "Howard the Duck", hp: 133, stamina: 138, attack: 43, accuracy: 39, defense: 32, evasion: 77, description: "An unlikely brawler armed with Quack Fu and a big gun." },
  { id: "punisher", name: "Punisher", role: "Vigilante", image: "Punisher", hp: 158, stamina: 148, attack: 43, accuracy: 39, defense: 37, evasion: 85, description: "A hard-hitting vigilante with rifles, grenades, and a battle van." },
  { id: "squirrelgirl", name: "Squirrel Girl", role: "Unbeatable Squirrel Girl", image: "Squirrel Girl", hp: 153, stamina: 158, attack: 41, accuracy: 42, defense: 41, evasion: 88, description: "A squirrel-powered fighter who brings furry fury to the battlefield." },
  { id: "captainamerica", name: "Captain America", role: "Super-Soldier", image: "Captain America", hp: 354, stamina: 302, attack: 66, accuracy: 66, defense: 97, evasion: 125, description: "A super-soldier with a powerful shield and team protection." },
  { id: "moonknight", name: "Moon Knight", role: "Fist of Khonshu", image: "Moon Knight", hp: 329, stamina: 302, attack: 71, accuracy: 68, defense: 72, evasion: 90, description: "A relentless warrior with crescent darts and lunar power." },
  { id: "cloakdagger", name: "Cloak & Dagger", role: "Lightforce and Darkforce", image: "Cloak & Dagger", hp: 274, stamina: 312, attack: 63, accuracy: 86, defense: 87, evasion: 200, description: "A duo who heal allies and debilitate enemies." },
  { id: "spiderman", name: "Spider-Man", role: "Friendly Neighborhood Hero", image: "Spider-Man", hp: 417, stamina: 421, attack: 122, accuracy: 130, defense: 115, evasion: 144, description: "An agile hero with web attacks, Spider Sense, and powerful strikes." },
  { id: "deadpool", name: "Deadpool", role: "Merc with a Mouth", image: "Deadpool", hp: 457, stamina: 455, attack: 133, accuracy: 106, defense: 100, evasion: 125, description: "A regenerative fighter with an unpredictable bag of tricks." },
  { id: "thing", name: "Thing", role: "Fantastic Four Powerhouse", image: "Thing", hp: 527, stamina: 435, attack: 86, accuracy: 105, defense: 173, evasion: 92, description: "A durable bruiser with rock-hard defense and heavy attacks." },
];
const STORAGE_KEY = "avengersAllianceSelectedHeroes";
const selected = new Set(HEROES.slice(0, 3).map(hero => hero.id));
const grid = document.getElementById("unlockedCharacterGrid");
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
    img.classList.add("portrait-" + hero.id);
    loadPortrait(img, hero.image);
    art.appendChild(img);
    const content = document.createElement("div");
    content.className = "character-content";
    const name = document.createElement("h3");
    name.textContent = hero.name;
    content.appendChild(name);
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
function saveTeamAndLaunch(url) {
  if (selected.size === 0) { error.textContent = "Select at least one hero to begin."; return; }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(HEROES.filter(hero => selected.has(hero.id)).map(hero => hero.id)));
  window.location.href = url;
}
startButton.addEventListener("click", () => saveTeamAndLaunch("battle/"));
document.getElementById("practice2StarBtn").addEventListener("click", () => saveTeamAndLaunch("battle/?practice=2-star"));
document.getElementById("practice3StarBtn").addEventListener("click", () => saveTeamAndLaunch("battle/?practice=3-star"));
render();
