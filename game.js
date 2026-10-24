"use strict";

/* =========================================
   MARVEL ALLIANCE - BATTLE PROTOTYPE
   ========================================= */

const $ = (id) => document.getElementById(id);

const MOVE_DATA = [
  { id:"shield-training", name:"S.H.I.E.L.D Training", attackType:"unarmed-melee", description:"Two-hit melee strike using S.H.I.E.L.D. combat training.", cost:8, damage:27, hits:2, accuracy:88, crit:11, cooldown:0, type:"attack", target:"enemy", owner:"phil" },
  { id:"smith-wesson", name:"Smith & Wesson", attackType:"ranged-gun", description:"A precise ranged shot with Phil's sidearm.", cost:15, damage:30, hits:1, accuracy:88, crit:11, cooldown:0, type:"attack", target:"enemy", owner:"phil" },
  { id:"destroyer-prototype", name:"Destroyer Prototype", attackType:"ranged-gun", description:"Fire the Destroyer Prototype at one enemy.", cost:22, damage:34.5, hits:1, accuracy:77, crit:10, cooldown:0, type:"attack", target:"enemy", owner:"phil" },
  { id:"pep-talk", name:"Pep Talk", attackType:"buff", description:"Give all allies a 20% damage boost for their next attack.", cost:7, damage:0, hits:0, accuracy:100, crit:0, cooldown:2, type:"buff", target:"all-allies", owner:"phil" },

  { id:"double-punch", name:"Double Punch", attackType:"unarmed-melee", description:"Two powerful punches against one enemy.", cost:8, damage:16.2, hits:2, accuracy:88, crit:11, cooldown:0, type:"attack", target:"enemy", owner:"bruiser" },
  { id:"shoulder-slam", name:"Shoulder Slam", attackType:"ranged-gun", description:"A forceful ranged strike against one enemy.", cost:15, damage:18, hits:1, accuracy:88, crit:11, cooldown:0, type:"attack", target:"enemy", owner:"bruiser" },
  { id:"spin-throw", name:"Spin Throw", attackType:"spin-melee", description:"Spin through the enemy formation, striking every enemy.", cost:22, damage:12.6, hits:1, accuracy:77, crit:10, cooldown:0, type:"attack", target:"all-enemies", owner:"bruiser" },
  { id:"shield-protect", name:"S.H.I.E.L.D", attackType:"buff", description:"Protect yourself and one ally from the next incoming attack.", cost:7, damage:0, hits:0, accuracy:100, crit:0, cooldown:2, type:"protect", target:"ally", owner:"bruiser" },

  { id:"combo", name:"Martial Arts Combo", attackType:"unarmed-melee", description:"Two melee hits against one enemy.", cost:8, damage:22.5, hits:2, accuracy:88, crit:11, cooldown:0, type:"attack", target:"enemy", owner:"blackwidow" },
  { id:"bite", name:"Widow's Bite", attackType:"ranged-gun", description:"A ranged electric shot against one enemy.", cost:15, damage:25, hits:1, accuracy:88, crit:11, cooldown:0, type:"attack", target:"enemy", owner:"blackwidow" },
  { id:"kick", name:"Flying Kick", attackType:"flying-melee", description:"Leap into one enemy with a powerful kick.", cost:22, damage:28.75, hits:1, accuracy:77, crit:10, cooldown:0, type:"attack", target:"enemy", owner:"blackwidow" },
  { id:"widowmaker", name:"Widowmaker", attackType:"ranged-gun", description:"Reduce target Attack by 50% for one round. Your next attack has a 75% chance to stun.", cost:7, damage:0, hits:0, accuracy:100, crit:0, cooldown:2, type:"debuff", target:"enemy", owner:"blackwidow" },

  { id:"hydra-strike", name:"Hydra Strike", attackType:"unarmed-melee", description:"A basic Hydra melee attack.", cost:8, damage:18, hits:1, accuracy:82, crit:8, cooldown:0, type:"attack", target:"enemy", enemyUsable:true }
];

function getMove(moveId) {
  return MOVE_DATA.find(move => move.id === moveId);
}
function getMovesForUnit(unit) {
  if (!unit) return [];
  if (unit.team === "enemy") return MOVE_DATA.filter(move => move.enemyUsable);
  return (unit.moveIds || []).map(getMove).filter(Boolean);
}

const HERO_TEMPLATES = [
  {
    id: "phil",
    name: "Phil Coulson",
    description: "S.H.I.E.L.D. field leader",
    image: "Phil",
    team: "hero",
    maxHp: 80,
    maxSta: 80,
    atk: 30,
    acc: 30,
    def: 15,
    eva: 15,
    moveIds: ["shield-training","smith-wesson","destroyer-prototype","pep-talk"]
  },
  {
    id: "bruiser",
    name: "S.H.I.E.L.D. Bruiser",
    description: "Heavy frontline fighter",
    image: "Bruiser",
    team: "hero",
    maxHp: 120,
    maxSta: 80,
    atk: 18,
    acc: 20,
    def: 35,
    eva: 20,
    moveIds: ["double-punch","shoulder-slam","spin-throw","shield-protect"]
  },
  {
    id: "blackwidow",
    name: "Black Widow",
    description: "Elite covert operative",
    image: "Black Widow",
    team: "hero",
    maxHp: 100,
    maxSta: 100,
    atk: 25,
    acc: 20,
    def: 20,
    eva: 25,
    moveIds: ["combo","bite","kick","widowmaker"]
  }
];

const ENEMY_TEMPLATES = [
  {
    id: "hydra1",
    name: "Hydra Soldier 1",
    description: "Hydra infantry",
    image: "Hydra",
    team: "enemy",
    maxHp: 80,
    maxSta: 80,
    atk: 30,
    acc: 30,
    def: 15,
    eva: 15
  },
  {
    id: "hydra2",
    name: "Hydra Soldier 2",
    description: "Hydra infantry",
    image: "Hydra",
    team: "enemy",
    maxHp: 80,
    maxSta: 80,
    atk: 30,
    acc: 30,
    def: 15,
    eva: 15
  },
  {
    id: "hydra3",
    name: "Hydra Soldier 3",
    description: "Hydra infantry",
    image: "Hydra",
    team: "enemy",
    maxHp: 80,
    maxSta: 80,
    atk: 30,
    acc: 30,
    def: 15,
    eva: 15
  }
];

/* =========================================
   GAME STATE
   ========================================= */

let heroes = [];
let enemies = [];
let round = 1;
const TOTAL_WAVES = 10;
let wave = 1;
let waveAnnouncementTimer = null;
let initiative = [];
let turnIndex = 0;
let currentActor = null;
let selectedHeroId = null;
let selectedTargetId = null;
let pendingMoveId = null;
let animatingActorId = null;
let animatingTargetId = null;
let animatingMoveId = null;
let animatingMode = null;
let animationToken = 0;
let battleOver = false;
let waitingForEnemy = false;
let imageExtensions = {};
let inspectedMoveId = null;

function createUnit(template) {
  return {
    ...template,
    hp: template.maxHp,
    sta: template.maxSta,
    baseAtk: template.atk,
    alive: true,
    cooldowns: {},
    attackDebuffTurns: 0,
    stunPrimed: false,
    stunned: false,
    damageBoost: 0,
    protectedUntilAttack: false
  };
}

function createWaveEnemies() {
  const multiplier = 1 + (wave - 1) * 0.01;
  return ENEMY_TEMPLATES.map(template => {
    const scaled = {
      ...template,
      maxHp: Math.round(template.maxHp * multiplier),
      maxSta: Math.round(template.maxSta * multiplier),
      atk: Math.round(template.atk * multiplier * 100) / 100,
      acc: Math.round(template.acc * multiplier * 100) / 100,
      def: Math.round(template.def * multiplier * 100) / 100,
      eva: Math.round(template.eva * multiplier * 100) / 100
    };
    return createUnit(scaled);
  });
}

function beginNextWave() {
  if (wave >= TOTAL_WAVES || battleOver) return;

  wave++;
  round = 1;
  turnIndex = 0;
  initiative = [];
  currentActor = null;
  pendingMoveId = null;
  selectedTargetId = null;
  waitingForEnemy = false;

  for (const hero of heroes) {
    if (!hero.alive) continue;
    const hpRestored = hero.maxHp * 0.30;
    const staRestored = hero.maxSta * 0.30;
    hero.hp = Math.min(hero.maxHp, hero.hp + hpRestored);
    hero.sta = Math.min(hero.maxSta, hero.sta + staRestored);
  }

  enemies = createWaveEnemies();
  log(`Wave cleared! Your team recovers 30% of maximum HP and stamina. Wave ${wave} of ${TOTAL_WAVES} begins.`, "good");
  renderAll();

  if (waveAnnouncementTimer !== null) clearTimeout(waveAnnouncementTimer);
  const announcement = $("waveAnnouncement");
  if (announcement) {
    announcement.textContent = `Wave ${wave}`;
    announcement.classList.remove("hidden");
    announcement.classList.remove("wave-announcement-show");
    void announcement.offsetWidth;
    announcement.classList.add("wave-announcement-show");
  }
  waveAnnouncementTimer = setTimeout(() => {
    if (announcement) {
      announcement.classList.add("hidden");
      announcement.classList.remove("wave-announcement-show");
    }
    waveAnnouncementTimer = null;
    if (!battleOver && wave > 1) startRound();
  }, 1200);
}

function resetBattle() {
  if (waveAnnouncementTimer !== null) {
    clearTimeout(waveAnnouncementTimer);
    waveAnnouncementTimer = null;
  }
  const announcement = $("waveAnnouncement");
  if (announcement) {
    announcement.classList.add("hidden");
    announcement.classList.remove("wave-announcement-show");
  }
  wave = 1;
  let selectedHeroIds = null;
  try {
    const savedSelection = JSON.parse(localStorage.getItem("avengersAllianceSelectedHeroes") || "null");
    if (Array.isArray(savedSelection)) {
      selectedHeroIds = savedSelection.filter(id => HERO_TEMPLATES.some(hero => hero.id === id));
    }
  } catch (_) {
    selectedHeroIds = null;
  }
  if (!selectedHeroIds || selectedHeroIds.length === 0) selectedHeroIds = HERO_TEMPLATES.map(hero => hero.id);
  heroes = HERO_TEMPLATES.filter(hero => selectedHeroIds.includes(hero.id)).map(createUnit);
  enemies = createWaveEnemies();

  round = 1;
  initiative = [];
  turnIndex = 0;
  currentActor = null;
  selectedHeroId = heroes[0].id;
  selectedTargetId = null;
  pendingMoveId = null;
  animatingActorId = null;
  animatingTargetId = null;
  animatingMoveId = null;
  animatingMode = null;
  battleOver = false;
  waitingForEnemy = false;

  $("resultOverlay").classList.add("hidden");
  $("battleLog").innerHTML = "";

  log("Battle started! S.H.I.E.L.D. versus Hydra.", "good");
  log(`Wave ${wave} of ${TOTAL_WAVES}: Hydra forces are advancing.`, "good");
  log("Choose an ability first, then select a Hydra target.");

  renderAll();
  startRound();
}

/* =========================================
   IMAGE LOADING
   ========================================= */

// Supports common image formats without requiring
// the file extension to be hardcoded in the templates.

function setCharacterImage(img, imageName) {
  const extensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  const savedExtension = imageExtensions[imageName];

  if (savedExtension) {
    img.src = `../assets/${imageName}${savedExtension}`;
    return;
  }

  let attempt = 0;

  function tryNextExtension() {
    if (attempt >= extensions.length) {
      img.onerror = null;
      img.style.display = "none";

      const fallback = document.createElement("span");
      fallback.className = "image-fallback";
      fallback.textContent = imageName;
      img.parentElement.appendChild(fallback);

      log(
        `Couldn't load ${imageName}. Check its filename and extension in assets.`,
        "miss"
      );
      return;
    }

    const extension = extensions[attempt++];
    img.src = `../assets/${encodeURIComponent(imageName)}${extension}`;
  }

  img.onerror = tryNextExtension;

  img.onload = function () {
    const match = img.src.match(/\.(png|jpg|jpeg|webp|gif)(?:[?#]|$)/i);
    if (match) {
      imageExtensions[imageName] = "." + match[1];
    }
  };

  tryNextExtension();
}

/* =========================================
   RENDERING
   ========================================= */

function renderAll() {
  renderTeam("heroTeam", heroes);
  renderTeam("enemyTeam", enemies);
  renderRoster();
  renderTurnOrder();
  renderMoveDock();
  applyCombatAnimationPath();

  const roundLabel = $("roundLabel");
  if (roundLabel) roundLabel.textContent = `ROUND ${round}`;

  renderCombatPanel();
}


function renderRoster() {
  const root = $("teamRoster");
  if (!root) return;
  root.innerHTML = "";
  for (const [teamName, units] of [["YOUR TEAM", heroes], ["HYDRA", enemies]]) {
    const group = document.createElement("div");
    group.className = "roster-group";
    const heading = document.createElement("h3");
    heading.textContent = teamName;
    group.appendChild(heading);
    for (const unit of [units[0], units[2], units[1]].filter(Boolean)) {
      const row = document.createElement("div");
      row.className = "roster-row" + (!unit.alive ? " defeated" : "") + (currentActor?.id === unit.id ? " roster-active" : "");
      const name = document.createElement("span");
      name.className = "roster-name";
      name.textContent = unit.name;
      const vitals = document.createElement("div");
      vitals.className = "roster-vitals";

      const hpLine = document.createElement("div");
      hpLine.className = "roster-vital-line";
      const hpLabel = document.createElement("span");
      hpLabel.className = "roster-hp-label";
      hpLabel.textContent = "HP";
      const hpTrack = document.createElement("div");
      hpTrack.className = "roster-bar roster-hp-track";
      const hpFill = document.createElement("div");
      hpFill.className = "roster-bar-fill";
      hpFill.style.width = `${Math.max(0, unit.hp / unit.maxHp * 100)}%`;
      hpTrack.appendChild(hpFill);
      const hpValue = document.createElement("span");
      hpValue.className = "roster-value";
      hpValue.textContent = `${Math.ceil(unit.hp)}`;
      hpLine.append(hpLabel, hpTrack, hpValue);

      const staLine = document.createElement("div");
      staLine.className = "roster-vital-line";
      const staLabel = document.createElement("span");
      staLabel.className = "roster-sta-label";
      staLabel.textContent = "STA";
      const staTrack = document.createElement("div");
      staTrack.className = "roster-bar roster-sta-track";
      const staFill = document.createElement("div");
      staFill.className = "roster-bar-fill";
      staFill.style.width = `${Math.max(0, unit.sta / unit.maxSta * 100)}%`;
      staTrack.appendChild(staFill);
      const staValue = document.createElement("span");
      staValue.className = "roster-value";
      staValue.textContent = `${Math.floor(unit.sta)}`;
      staLine.append(staLabel, staTrack, staValue);

      vitals.append(hpLine, staLine);
      row.append(name, vitals);
      group.appendChild(row);
    }
    root.appendChild(group);
  }
}

function renderTurnOrder() {
  const root = $("turnOrder");
  if (!root) return;
  root.innerHTML = "";

  const label = document.createElement("span");
  label.className = "turn-order-label";
  label.textContent = "TURN ORDER";
  root.appendChild(label);

  const track = document.createElement("div");
  track.className = "turn-order-track";
  const orderedIds = initiative.length ? initiative : [...heroes, ...enemies].map(unit => unit.id);
  orderedIds.forEach((id, index) => {
    const unit = [...heroes, ...enemies].find(candidate => candidate.id === id);
    if (!unit) return;
    const chip = document.createElement("div");
    chip.className = [
      "turn-chip",
      unit.team,
      currentActor?.id === unit.id ? "current" : "",
      index < turnIndex && currentActor?.id !== unit.id ? "past" : "",
      !unit.alive ? "defeated" : ""
    ].filter(Boolean).join(" ");
    chip.title = unit.name + (currentActor?.id === unit.id ? " — current turn" : "");
    chip.setAttribute("aria-label", chip.title);
    const img = document.createElement("img");
    img.alt = unit.name;
    img.loading = "eager";
    setCharacterImage(img, unit.image);
    chip.appendChild(img);
    track.appendChild(chip);
  });
  root.appendChild(track);

  const waveCounter = document.createElement("span");
  waveCounter.className = "wave-counter";
  waveCounter.textContent = `Wave ${wave}`;
  waveCounter.setAttribute("aria-label", `Wave ${wave} of ${TOTAL_WAVES}`);
  root.appendChild(waveCounter);
}

function renderTeam(containerId, units) {
  const container = $(containerId);
  container.innerHTML = "";

  for (const unit of units) {
    const card = document.createElement("div");

    const isSelected =
      unit.team === "hero"
        ? selectedHeroId === unit.id
        : selectedTargetId === unit.id;

    const isActive = currentActor && currentActor.id === unit.id;

    card.className = [
      "unit",
      unit.team,
      isSelected ? "selected" : "",
      isActive ? "active-turn" : "",
      unit.alive && !!pendingMoveId && ((unit.team === "enemy" && getMove(pendingMoveId)?.target !== "ally" && getMove(pendingMoveId)?.target !== "all-allies") || (unit.team === "hero" && ["ally","all-allies"].includes(getMove(pendingMoveId)?.target))) ? "pending-target" : "",
      animatingActorId === unit.id ? "attacking" : "",
      animatingActorId === unit.id && animatingMoveId ? `attack-${getMove(animatingMoveId)?.attackType || "unarmed-melee"}` : "",
      animatingActorId === unit.id && animatingMode === "sweep" ? "attack-sweep" : "",
      animatingActorId === unit.id && animatingMode === "buff" ? "attack-buff" : "",
      animatingTargetId === unit.id ? "taking-hit" : "",
      !unit.alive ? "dead" : ""
    ].filter(Boolean).join(" ");

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", unit.alive ? "0" : "-1");
    card.setAttribute("aria-label", unit.name);
    card.dataset.unitId = unit.id;

    const portrait = document.createElement("div");
    portrait.className = "portrait";

    const img = document.createElement("img");
    img.alt = unit.name;
    img.loading = "eager";
    setCharacterImage(img, unit.image);
    portrait.appendChild(img);

    const name = document.createElement("div");
    name.className = "unit-name";
    name.textContent = unit.name;

    const hpBar = document.createElement("div");
    hpBar.className = "battle-unit-hp";
    hpBar.setAttribute("aria-label", `Health: ${Math.max(0, unit.hp)} of ${unit.maxHp}`);
    const hpFill = document.createElement("span");
    hpFill.className = "battle-unit-hp-fill";
    hpFill.style.width = `${Math.max(0, Math.min(100, (unit.hp / unit.maxHp) * 100))}%`;
    hpBar.appendChild(hpFill);

    const pendingMove = pendingMoveId ? getMove(pendingMoveId) : null;
    const selectedMove = unit.team === "enemy" && unit.alive && pendingMove && ["enemy","all-enemies"].includes(pendingMove.target)
      ? pendingMove
      : null;
    if (selectedMove && selectedMove.type === "attack" && selectedMove.damage > 0) {
      const damagePreview = document.createElement("span");
      damagePreview.className = "battle-unit-hp-preview";
      const previewDamage = Math.min(unit.hp, selectedMove.damage);
      const previewPercent = previewDamage / unit.maxHp * 100;
      const currentPercent = Math.max(0, Math.min(100, unit.hp / unit.maxHp * 100));
      damagePreview.style.left = `${Math.max(0, currentPercent - previewPercent)}%`;
      damagePreview.style.width = `${Math.min(currentPercent, previewPercent)}%`;
      damagePreview.setAttribute("aria-label", `Approximate damage preview: ${Math.round(previewDamage)}`);
      hpBar.appendChild(damagePreview);
    }

    const staBar = document.createElement("div");
    staBar.className = "battle-unit-sta";
    staBar.setAttribute("aria-label", `Stamina: ${Math.max(0, unit.sta)} of ${unit.maxSta}`);
    const staFill = document.createElement("span");
    staFill.className = "battle-unit-sta-fill";
    staFill.style.width = `${Math.max(0, Math.min(100, (unit.sta / unit.maxSta) * 100))}%`;
    staBar.appendChild(staFill);

    const previewMove = currentActor?.id === unit.id && unit.team === "hero"
      ? MOVE_DATA.find(move => move.id === pendingMoveId)
      : null;
    if (previewMove && previewMove.cost > 0) {
      const costPreview = document.createElement("span");
      costPreview.className = "battle-unit-sta-cost";
      const currentPercent = Math.max(0, Math.min(100, (unit.sta / unit.maxSta) * 100));
      const costPercent = Math.min(unit.sta, previewMove.cost) / unit.maxSta * 100;
      costPreview.style.left = `${Math.max(0, currentPercent - costPercent)}%`;
      costPreview.style.width = `${costPercent}%`;
      costPreview.setAttribute("aria-label", `${previewMove.cost} stamina cost preview`);
      staBar.appendChild(costPreview);
    }

    const status = document.createElement("div");
    status.className = "unit-status";

    const statuses = [];
    if (!unit.alive) statuses.push("DEFEATED");
    if (unit.stunned) statuses.push("STUNNED");
    if (unit.attackDebuffTurns > 0) statuses.push("ATTACK -50%");
    if (unit.stunPrimed) statuses.push("STUN READY");

    status.textContent = statuses.join(" • ");

    if (unit.team === "hero" && (isActive || (unit.alive && pendingMove && ["ally","all-allies"].includes(pendingMove.target)))) {
      if (isActive) card.append(name, hpBar, staBar, portrait, status);
      else card.append(portrait, name, hpBar, status);
    } else if (unit.team === "enemy") card.append(portrait, name, hpBar, status);
    else card.append(portrait, name, status);

    card.addEventListener("click", () => selectUnit(unit));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectUnit(unit);
      }
    });

    container.appendChild(card);

    // Add effects after each render so they survive the UI refresh after an attack.
    if (animatingActorId === unit.id) {
      const effect = document.createElement("span");
      const move = getMove(animatingMoveId);
      const attackType = move?.attackType || "unarmed-melee";
      effect.className = `combat-effect ${attackType === "ranged-gun" ? "projectile" : attackType === "flying-melee" ? "kick-strike" : "slash"} ${attackType}`;
      effect.setAttribute("aria-hidden", "true");
      card.appendChild(effect);
    }
    if (animatingTargetId === unit.id) {
      const impact = document.createElement("span");
      impact.className = "combat-effect impact-burst";
      impact.setAttribute("aria-hidden", "true");
      card.appendChild(impact);
    }
  }
}

function moveIconGlyph(moveId) {
  return moveId === "combo" ? "⚔" : moveId === "bite" ? "⚡" : moveId === "kick" ? "➤" : "◎";
}

function renderMoveDock() {
  const dock = $("moveDock");
  if (!dock) return;
  dock.innerHTML = "";
  for (const move of getMovesForUnit(currentActor)) {
    const actor = currentActor;
    const hero = actor && actor.team === "hero" ? actor : null;
    const cooldown = hero ? (hero.cooldowns[move.id] || 0) : 0;
    const affordable = !!hero && hero.sta >= move.cost;
    const unavailable = !hero || !hero.alive || battleOver || waitingForEnemy || !affordable || cooldown > 0;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "move-dock-icon" + (pendingMoveId === move.id ? " selected" : "") + (unavailable ? " unavailable" : "");
    button.setAttribute("aria-label", move.name + " details");
    button.title = move.name;
    const details = document.createElement("span");
    details.className = "move-dock-details";
    const moveName = document.createElement("strong");
    moveName.className = "move-dock-name";
    moveName.textContent = move.name;
    const moveStats = document.createElement("span");
    moveStats.className = "move-dock-stats";
    const damage = move.damage > 0 ? String(Math.round(move.damage)) : "0";
    const statValues = [
      ["move-stat-damage", "Damage", damage],
      ["move-stat-stamina", "Stamina:", String(Math.round(move.cost))],
      ["move-stat-accuracy", "Accuracy:", `${Math.round(move.accuracy)}%`],
      ["move-stat-crit", "Crit:", `${Math.round(move.crit)}%`]
    ];
    for (const [className, labelText, value] of statValues) {
      const stat = document.createElement("span");
      stat.className = className;
      const label = document.createElement("span");
      label.className = "move-stat-label";
      label.textContent = labelText;
      const number = document.createElement("span");
      number.className = "move-stat-value";
      number.textContent = value;
      stat.append(label, number);
      moveStats.appendChild(stat);
    }
    details.append(moveName, moveStats);
    button.append(details);
    let lastTapAt = 0;
    button.addEventListener("click", () => {
      const now = Date.now();
      const isDoubleTap = now - lastTapAt <= 450;
      lastTapAt = now;

      if (
        isDoubleTap &&
        inspectedMoveId === move.id &&
        !$("moveInfoOverlay").classList.contains("hidden")
      ) {
        // A second tap on the same icon confirms the move and closes its details.
        $("selectMoveBtn").click();
        return;
      }
      openMoveInfo(move.id);
    });
    dock.appendChild(button);
  }
}

function openMoveInfo(moveId) {
  const move = getMove(moveId);
  if (!move) return;
  inspectedMoveId = moveId;
  const actor = currentActor;
  const hero = actor && actor.team === "hero" ? actor : null;
  const cooldown = hero ? (hero.cooldowns[move.id] || 0) : 0;
  const affordable = !!hero && hero.sta >= move.cost;
  const unavailable = !hero || !hero.alive || battleOver || waitingForEnemy || !affordable || cooldown > 0;
  $("moveInfoIcon").textContent = moveIconGlyph(move.id);
  $("moveInfoTitle").textContent = move.name;
  $("moveInfoDescription").textContent = move.description;
  const stats = $("moveInfoStats");
  stats.innerHTML = "";
  const values = [
    ["BASE DAMAGE", move.damage > 0 ? (move.hits > 1 ? `${Math.round(move.damage / move.hits)} × ${move.hits} hits` : String(Math.round(move.damage))) : "—"],
    ["STAMINA", String(move.cost)],
    ["ACCURACY", `${move.accuracy}%`],
    ["CRITICAL", `${move.crit}%`]
  ];
  if (cooldown > 0) values.push(["COOLDOWN", `${cooldown} turn(s)`]);
  for (const [label, value] of values) {
    const item = document.createElement("div");
    item.className = "move-info-stat";
    const name = document.createElement("span");
    name.textContent = label;
    const val = document.createElement("strong");
    val.textContent = value;
    item.append(name, val);
    stats.appendChild(item);
  }
  const select = $("selectMoveBtn");
  select.disabled = unavailable;
  select.textContent = cooldown > 0 ? `Cooldown: ${cooldown} turn(s)` : !hero ? "Your turn only" : !affordable ? "Not enough stamina" : "Select Move";
  const overlay = $("moveInfoOverlay");
  const card = overlay.querySelector(".move-info-card");
  overlay.classList.remove("hidden");
  // Anchor the compact popup just above the move dock so the icons stay visible
  // and another ability can be tapped without first closing the details.
  requestAnimationFrame(() => {
    const dock = $("moveDock");
    const dockRect = dock.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const top = Math.max(8, dockRect.top - cardRect.height - 8);
    card.style.top = `${top}px`;
    card.style.left = "50%";
    card.style.transform = "translateX(-50%)";
  });
}

function closeMoveInfo() {
  $("moveInfoOverlay").classList.add("hidden");
  inspectedMoveId = null;
}

function renderCombatPanel() {
  const actor = currentActor;
  $("endTurnBtn").disabled =
    battleOver ||
    waitingForEnemy ||
    !actor ||
    actor.team !== "hero";
  $("endTurnBtn").style.opacity = $("endTurnBtn").disabled ? "0.5" : "1";
}

function selectUnit(unit) {
  if (!unit.alive || battleOver) return;
  if (!currentActor || currentActor.team !== "hero" || waitingForEnemy) return;
  if (!pendingMoveId) {
    if (unit.team === "enemy") { selectedTargetId = unit.id; renderAll(); }
    return;
  }
  const move = getMove(pendingMoveId);
  if (!move) return;
  const validTarget = ["ally","all-allies"].includes(move.target) ? unit.team === "hero" : unit.team === "enemy";
  if (!validTarget) {
    log(move.target === "ally" ? "Select a living ally for this move." : "Select a living enemy for this move.", "miss");
    return;
  }
  const moveId = pendingMoveId;
  pendingMoveId = null;
  useMove(moveId, unit);
}

/* =========================================
   TURN SYSTEM
   ========================================= */

function startRound() {
  if (battleOver) return;

  initiative = [...heroes, ...enemies]
    .filter(unit => unit.alive)
    .map((unit, index) => ({ id: unit.id, evasion: unit.eva, index }))
    .sort((a, b) => {
      const evasionDifference = b.evasion - a.evasion;
      // Higher evasion acts first; equal evasion is broken randomly.
      return evasionDifference || (Math.random() < 0.5 ? -1 : 1);
    })
    .map(item => item.id);

  turnIndex = 0;

  log(`--- ROUND ${round} ---`, "good");
  nextTurn();
}

function nextTurn() {
  if (battleOver) return;

  if (checkBattleEnd()) return;

  if (turnIndex >= initiative.length) {
    endRound();
    return;
  }

  const id = initiative[turnIndex];
  const unit = getUnit(id);

  if (!unit || !unit.alive) {
    turnIndex++;
    nextTurn();
    return;
  }

  currentActor = unit;
  pendingMoveId = null;

  if (unit.stunned) {
    unit.stunned = false;

    if (unit.attackDebuffTurns > 0) {
      unit.attackDebuffTurns--;
      if (unit.attackDebuffTurns === 0) {
        unit.atk = unit.baseAtk;
      }
    }

    log(`${unit.name} is stunned and loses their turn!`, "miss");
    renderAll();

    turnIndex++;
    window.setTimeout(nextTurn, 750);
    return;
  }

  if (unit.team === "hero") {
    selectedHeroId = unit.id;

    if (!enemies.some(e => e.alive)) {
      checkBattleEnd();
      return;
    }

    const turnLabel = $("turnLabel");
    if (turnLabel) {
      turnLabel.textContent = "YOUR TURN";
      turnLabel.style.color = "var(--green)";
    }
    renderAll();
    log(`${unit.name}'s turn.`);
  } else {
    const turnLabel = $("turnLabel");
    if (turnLabel) {
      turnLabel.textContent = "HYDRA TURN";
      turnLabel.style.color = "var(--red)";
    }
    renderAll();

    waitingForEnemy = true;
    renderCombatPanel();

    window.setTimeout(enemyAct, 1000);
  }
}

function endRound() {
  if (battleOver) return;

  for (const unit of [...heroes, ...enemies]) {
    if (!unit.alive) continue;

    unit.sta = Math.min(unit.maxSta, unit.sta + 5);

    for (const move of MOVE_DATA) {
      if (unit.cooldowns[move.id] > 0) {
        unit.cooldowns[move.id]--;
      }
    }
  }

  round++;
  currentActor = null;

  renderAll();
  startRound();
}

function applyCombatAnimationPath() {
  if (!animatingActorId || !animatingTargetId) return;

  const actorCard = document.querySelector(`.unit[data-unit-id="${animatingActorId}"]`);
  const targetCard = document.querySelector(`.unit[data-unit-id="${animatingTargetId}"]`);
  if (!actorCard || !targetCard) return;

  const actorRect = actorCard.getBoundingClientRect();
  const targetRect = targetCard.getBoundingClientRect();
  const dx = (targetRect.left + targetRect.width / 2) - (actorRect.left + actorRect.width / 2);
  const dy = (targetRect.top + targetRect.height / 2) - (actorRect.top + actorRect.height / 2);
  const distance = Math.hypot(dx, dy) || 1;
  // Move toward the target but stop short so the portraits never cover one another completely.
  const move = getMove(animatingMoveId);
  const isMelee = !move || !["ranged-gun","buff"].includes(move.attackType);
  const travel = isMelee ? Math.min(distance * 0.72, Math.max(40, distance - Math.min(targetRect.width * 0.42, 70))) : 0;
  const x = dx / distance * travel;
  const y = dy / distance * travel;

  if (move?.target === "all-enemies" || move?.attackType === "spin-melee") {
    const enemyCards = [...document.querySelectorAll(actorCard.classList.contains("hero") ? ".unit.enemy:not(.defeated)" : ".unit.hero:not(.defeated)")];
    if (enemyCards.length) {
      const rects = enemyCards.map(card => card.getBoundingClientRect());
      const centerX = rects.reduce((sum, rect) => sum + rect.left + rect.width / 2, 0) / rects.length;
      const centerY = rects.reduce((sum, rect) => sum + rect.top + rect.height / 2, 0) / rects.length;
      const cdx = centerX - (actorRect.left + actorRect.width / 2);
      const cdy = centerY - (actorRect.top + actorRect.height / 2);
      const cd = Math.hypot(cdx, cdy) || 1;
      const ct = Math.min(cd * 0.62, Math.max(48, cd - 35));
      actorCard.style.setProperty("--attack-x", `${cdx / cd * ct}px`);
      actorCard.style.setProperty("--attack-y", `${cdy / cd * ct}px`);
    }
  } else {
    actorCard.style.setProperty("--attack-x", `${x}px`);
    actorCard.style.setProperty("--attack-y", `${y}px`);
  }
  actorCard.style.setProperty("--target-x", `${dx}px`);
  actorCard.style.setProperty("--target-y", `${dy}px`);
}

function triggerCombatAnimation(actor, target, move) {
  animatingActorId = actor.id;
  animatingTargetId = target.id;
  animatingMoveId = move ? move.id : null;
  animatingMode = move?.target === "all-enemies" ? "sweep" : move?.target === "all-allies" ? "buff" : null;
  const token = ++animationToken;

  window.setTimeout(() => {
    if (token !== animationToken) return;
    animatingActorId = null;
    animatingTargetId = null;
    animatingMoveId = null;
    animatingMode = null;
    renderAll();
  }, 1280);
}

function showDamageNumber(target, amount, critical = false, missed = false, delay = 80) {
  // Anchor each damage number to the unit that was hit, on both desktop and mobile.
  window.setTimeout(() => {
    const number = document.createElement("span");
    number.className = "damage-number damage-overlay" + (critical ? " critical" : "") + (missed ? " miss-number" : "");
    number.textContent = missed ? "DODGE" : String(Math.round(amount));
    number.setAttribute("aria-hidden", "true");

    let x = window.innerWidth / 2;
    let y = Math.max(16, window.innerHeight * 0.3);
    const card = document.querySelector(`.unit[data-unit-id="${target.id}"]`);
    if (card) {
      const rect = card.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      // Keep the number near the character's head, just above the portrait's upper area.
      y = Math.max(8, rect.top + Math.min(34, rect.height * 0.16));
    }

    number.style.setProperty("left", x + "px", "important");
    number.style.setProperty("top", y + "px", "important");
    document.body.appendChild(number);
    window.setTimeout(() => number.remove(), 950);
  }, delay);
}

/* =========================================
   PLAYER ABILITIES
   ========================================= */

function useMove(moveId, chosenTarget = null) {
  if (battleOver || waitingForEnemy || !currentActor || currentActor.team !== "hero" || !currentActor.alive) return;
  const actor = currentActor;
  const move = getMove(moveId);
  if (!move) return;
  if (actor.sta < move.cost) { log(`${actor.name} doesn't have enough stamina.`, "miss"); return; }
  if ((actor.cooldowns[move.id] || 0) > 0) { log(`${move.name} is still on cooldown.`, "miss"); return; }

  const targetTeam = ["ally","all-allies"].includes(move.target) ? heroes : enemies;
  const requiresTarget = ["enemy","ally","all-enemies","all-allies"].includes(move.target);
  const target = !requiresTarget ? null : (chosenTarget && chosenTarget.alive && targetTeam.some(unit => unit.id === chosenTarget.id)
    ? chosenTarget : targetTeam.find(unit => unit.id === selectedTargetId && unit.alive));
  if (["enemy","ally","all-enemies","all-allies"].includes(move.target) && !target) {
    log(["ally","all-allies"].includes(move.target) ? "Select a living ally first." : "Select a living enemy first.", "miss");
    return;
  }

  actor.sta -= move.cost;
  pendingMoveId = null;
  if (target) selectedTargetId = target.id;
  const animationTarget = target || enemies.find(unit => unit.alive);
  if (animationTarget) triggerCombatAnimation(actor, animationTarget, move);

  if (move.target === "all-enemies") {
    performAttackOnTargets(actor, enemies.filter(unit => unit.alive), move);
  } else if (move.target === "all-allies") {
    for (const ally of heroes.filter(unit => unit.alive)) ally.damageBoost = Math.max(ally.damageBoost || 0, 0.2);
    actor.cooldowns[move.id] = move.cooldown;
    log(`${actor.name} uses Pep Talk! All living allies, including ${actor.name}, gain a 20% damage boost for their next attack.`, "good");
  } else if (move.type === "protect") {
    const protectedAllies = [...new Set([target, actor].filter(unit => unit.alive))];
    for (const ally of protectedAllies) ally.protectedUntilAttack = true;
    actor.cooldowns[move.id] = move.cooldown;
    log(`${actor.name} uses S.H.I.E.L.D! ${protectedAllies.map(ally => ally.name).join(" and ")} ${protectedAllies.length === 1 ? "is" : "are"} protected from the next attack.`, "good");
  } else if (move.type === "debuff") {
    useWidowmaker(actor, target, move);
  } else {
    performAttack(actor, target, move);
  }

  renderAll();
  if (checkBattleEnd()) return;
  turnIndex++;
  window.setTimeout(nextTurn, 1550);
}

function performAttackOnTargets(actor, targets, move) {
  log(`${actor.name} uses ${move.name} against the enemy formation!`);
  for (const target of targets) {
    if (!target.alive || !actor.alive) continue;
    const hitChance = move.accuracy / 100;
    if (target.protectedUntilAttack) {
      target.protectedUntilAttack = false;
      log(`${target.name} is protected by S.H.I.E.L.D! The incoming attack deals no damage, and the protection wears off.`, "good");
      continue;
    }
    if (Math.random() > hitChance) {
      log(`${move.name} misses ${target.name}!`, "miss");
      showDamageNumber(target, 0, false, true, 100);
      continue;
    }
    const damage = calculateDamage(actor, target, move);
    target.hp = Math.max(0, target.hp - damage.amount);
    showDamageNumber(target, damage.amount, damage.critical, false, 100);
    log(`${damage.critical ? "CRITICAL! " : ""}${target.name} takes ${damage.amount} damage.`, "damage");
    if (target.hp <= 0) { target.alive = false; target.hp = 0; log(`${target.name} has been defeated!`, "good"); }
  }
  if (actor.team === "hero" && actor.damageBoost > 0) {
    actor.damageBoost = 0;
    log(`${actor.name} uses up the Pep Talk boost.`, "good");
  }
}
function useWidowmaker(actor, target, move) {
  target.attackDebuffTurns = 1;
  target.atk = target.baseAtk * 0.5;
  actor.stunPrimed = true;
  actor.cooldowns[move.id] = move.cooldown;
  log(`${actor.name} uses Widowmaker! ${target.name}'s Attack is reduced by 50% until their next action.`, "good");
  log(`${actor.name}'s next attack has a 75% chance to stun its target.`);
}
function performAttack(actor, target, move) {
  log(`${actor.name} uses ${move.name} on ${target.name}.`);
  for (let hitNumber = 1; hitNumber <= move.hits; hitNumber++) {
    if (!target.alive || !actor.alive) break;
    if (target.protectedUntilAttack) {
      target.protectedUntilAttack = false;
      log(`${target.name} is protected by S.H.I.E.L.D! The incoming attack deals no damage, and the protection wears off.`, "good");
      break;
    }
    if (Math.random() > move.accuracy / 100) {
      log(`${move.name} misses ${target.name}!`, "miss");
      showDamageNumber(target, 0, false, true, 80 + (hitNumber - 1) * 480);
      continue;
    }
    const damage = calculateDamage(actor, target, move);
    target.hp = Math.max(0, target.hp - damage.amount);
    showDamageNumber(target, damage.amount, damage.critical, false, 80 + (hitNumber - 1) * 480);
    log(`${damage.critical ? "CRITICAL! " : ""}${target.name} takes ${damage.amount} damage.`, "damage");
    if (actor.stunPrimed) {
      actor.stunPrimed = false;
      if (Math.random() < 0.75 && target.alive) { target.stunned = true; log(`${target.name} is stunned and will lose their next action!`, "good"); }
      else log("The stun attempt fails.");
    }
    if (target.hp <= 0) { target.alive = false; target.hp = 0; log(`${target.name} has been defeated!`, "good"); }
  }
  if (actor.team === "hero" && actor.damageBoost > 0) {
    actor.damageBoost = 0;
    log(`${actor.name} uses up the Pep Talk boost.`, "good");
  }
}

function calculateDamage(attacker, target, move) {
  let varianceMin;
  let varianceMax;

  if (attacker.atk > target.def) {
    varianceMin = -0.02;
    varianceMax = 0.10;
  } else if (attacker.atk < target.def) {
    varianceMin = -0.10;
    varianceMax = 0.02;
  } else {
    varianceMin = -0.10;
    varianceMax = 0.10;
  }

  const variance =
    varianceMin + Math.random() * (varianceMax - varianceMin);

  let amount = move.damage / move.hits;
  amount *= 1 + variance;
  if (attacker.team === "enemy") {
    amount *= 1 + (wave - 1) * 0.01;
  }
  amount *= 1 + (attacker.damageBoost || 0);

  const critical = Math.random() < move.crit / 100;

  if (critical) {
    amount *= 1.15 + Math.random() * 0.10;
  }

  return {
    amount: Math.max(1, Math.round(amount * 10) / 10),
    critical
  };
}

/* =========================================
   ENEMY AI
   ========================================= */

function enemyAct() {
  if (battleOver || !currentActor || currentActor.team !== "enemy") {
    waitingForEnemy = false;
    return;
  }

  const actor = currentActor;

  if (!actor.alive) {
    waitingForEnemy = false;
    turnIndex++;
    nextTurn();
    return;
  }

  const livingHeroes = heroes.filter(h => h.alive);

  if (livingHeroes.length === 0) {
    waitingForEnemy = false;
    checkBattleEnd();
    return;
  }

  const target =
    livingHeroes[Math.floor(Math.random() * livingHeroes.length)];

  const availableMoves = MOVE_DATA.filter(move =>
    move.enemyUsable && move.type === "attack" &&
    actor.sta >= move.cost &&
    (actor.cooldowns[move.id] || 0) === 0
  );

  if (availableMoves.length === 0) {
    log(`${actor.name} has insufficient stamina and skips their attack.`);
  } else {
    // Hydra chooses an affordable attack, favoring stronger moves.
    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    actor.sta -= move.cost;
    triggerCombatAnimation(actor, target, move);
    performAttack(actor, target, move);
  }

  if (actor.attackDebuffTurns > 0) {
    actor.attackDebuffTurns--;

    if (actor.attackDebuffTurns === 0) {
      actor.atk = actor.baseAtk;
      log(`${actor.name}'s Attack returns to normal.`);
    }
  }

  waitingForEnemy = false;
  renderAll();

  if (checkBattleEnd()) return;

  turnIndex++;
  window.setTimeout(nextTurn, 1550);
}

/* =========================================
   BATTLE END AND UTILITIES
   ========================================= */

function getUnit(id) {
  return [...heroes, ...enemies].find(unit => unit.id === id);
}

function checkBattleEnd() {
  if (battleOver) return true;

  const heroesAlive = heroes.some(h => h.alive);
  const enemiesAlive = enemies.some(e => e.alive);

  if (heroesAlive && enemiesAlive) return false;

  if (heroesAlive && !enemiesAlive && wave < TOTAL_WAVES) {
    beginNextWave();
    return true;
  }

  battleOver = true;
  waitingForEnemy = false;

  const victory = heroesAlive;

  $("resultTitle").textContent = victory ? "VICTORY!" : "DEFEAT";
  $("resultTitle").style.color =
    victory ? "var(--gold)" : "var(--red)";

  $("resultMessage").textContent = victory
    ? "Hydra has been defeated. Your team wins the battle!"
    : "Your entire team has been defeated by Hydra.";

  const turnLabel = $("turnLabel");
  if (turnLabel) turnLabel.textContent = "BATTLE OVER";
  $("resultOverlay").classList.remove("hidden");

  renderAll();
  return true;
}

function log(message, type = "") {
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`.trim();
  entry.textContent = message;

  $("battleLog").prepend(entry);
}

$("endTurnBtn").addEventListener("click", () => {
  if (
    battleOver ||
    waitingForEnemy ||
    !currentActor ||
    currentActor.team !== "hero"
  ) {
    return;
  }

  pendingMoveId = null;
  log(`${currentActor.name} skips their turn.`);
  turnIndex++;
  nextTurn();
});

$("restartBtn").addEventListener("click", resetBattle);
$("closeMoveInfoBtn").addEventListener("click", closeMoveInfo);
$("moveInfoOverlay").addEventListener("click", event => {
  if (event.target === $("moveInfoOverlay")) closeMoveInfo();
});
$("selectMoveBtn").addEventListener("click", () => {
  if (!inspectedMoveId) return;
  const move = getMove(inspectedMoveId);
  const actor = currentActor;
  if (!move || !actor || actor.team !== "hero" || !actor.alive || battleOver || waitingForEnemy) return;
  const cooldown = actor.cooldowns[move.id] || 0;
  if (actor.sta < move.cost || cooldown > 0) return;
  closeMoveInfo();
  
  pendingMoveId = move.id;
  renderAll();
  log(`${move.name} selected. ${["ally","all-allies"].includes(move.target) ? "Now select an ally." : "Now select an enemy to initiate the attack."}`, "good");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !$("moveInfoOverlay").classList.contains("hidden")) closeMoveInfo();
});
$("playAgainBtn").addEventListener("click", resetBattle);

$("clearLogBtn").addEventListener("click", () => {
  $("battleLog").innerHTML = "";
});

resetBattle();
