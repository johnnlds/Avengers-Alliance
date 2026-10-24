"use strict";

/* =========================================
   MARVEL ALLIANCE - BATTLE PROTOTYPE
   ========================================= */

const $ = (id) => document.getElementById(id);

const MOVE_DATA = [
  {
    id: "combo",
    attackType: "unarmed-melee",
    name: "Martial Arts Combo",
    description: "Two melee hits. 88% accuracy and 11% critical chance per hit.",
    cost: 9,
    damage: 22.5,
    hits: 2,
    accuracy: 88,
    crit: 11,
    cooldown: 0,
    type: "attack"
  },
  {
    id: "bite",
    attackType: "ranged-gun",
    name: "Widow's Bite",
    description: "Ranged attack. 25 base damage, 88% accuracy.",
    cost: 18,
    damage: 25,
    hits: 1,
    accuracy: 88,
    crit: 11,
    cooldown: 0,
    type: "attack"
  },
  {
    id: "kick",
    attackType: "flying-melee",
    name: "Flying Kick",
    description: "Powerful melee attack. 28.75 base damage, 77% accuracy.",
    cost: 23,
    damage: 28.75,
    hits: 1,
    accuracy: 77,
    crit: 10,
    cooldown: 0,
    type: "attack"
  },
  {
    id: "widowmaker",
    attackType: "ranged-gun",
    name: "Widowmaker",
    description: "Costs 7 stamina. Reduces target Attack by 50% for one turn. Your next attack has a 75% chance to stun.",
    cost: 7,
    damage: 0,
    hits: 0,
    accuracy: 100,
    crit: 0,
    cooldown: 2,
    type: "debuff"
  }
];

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
    eva: 15
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
    eva: 20
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
    eva: 25
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
let initiative = [];
let turnIndex = 0;
let currentActor = null;
let selectedHeroId = null;
let selectedTargetId = null;
let pendingMoveId = null;
let animatingActorId = null;
let animatingTargetId = null;
let animatingMoveId = null;
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
    stunned: false
  };
}

function resetBattle() {
  heroes = HERO_TEMPLATES.map(createUnit);
  enemies = ENEMY_TEMPLATES.map(createUnit);

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
  battleOver = false;
  waitingForEnemy = false;

  $("resultOverlay").classList.add("hidden");
  $("battleLog").innerHTML = "";

  log("Battle started! S.H.I.E.L.D. versus Hydra.", "good");
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
    img.src = `assets/${imageName}${savedExtension}`;
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
    img.src = `assets/${encodeURIComponent(imageName)}${extension}`;
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
    for (const unit of units) {
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
      hpValue.textContent = `${Math.ceil(unit.hp)}/${unit.maxHp}`;
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
      staValue.textContent = `${Math.floor(unit.sta)}/${unit.maxSta}`;
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
      animatingActorId === unit.id ? "attacking" : "",
      animatingActorId === unit.id && animatingMoveId ? `attack-${MOVE_DATA.find(m => m.id === animatingMoveId)?.attackType || "unarmed-melee"}` : "",
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

    const status = document.createElement("div");
    status.className = "unit-status";

    const statuses = [];
    if (!unit.alive) statuses.push("DEFEATED");
    if (unit.stunned) statuses.push("STUNNED");
    if (unit.attackDebuffTurns > 0) statuses.push("ATTACK -50%");
    if (unit.stunPrimed) statuses.push("STUN READY");

    status.textContent = statuses.join(" • ");

    card.append(portrait, name, status);

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
      const move = MOVE_DATA.find(m => m.id === animatingMoveId);
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
  for (const move of MOVE_DATA) {
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
    const glyph = document.createElement("span");
    glyph.className = "move-dock-glyph";
    glyph.textContent = moveIconGlyph(move.id);
    const details = document.createElement("span");
    details.className = "move-dock-details";
    const moveName = document.createElement("strong");
    moveName.className = "move-dock-name";
    moveName.textContent = move.name;
    const moveStats = document.createElement("span");
    moveStats.className = "move-dock-stats";
    const damage = move.damage > 0 ? String(Number(move.damage.toFixed(2))) : "0";
    moveStats.textContent = `Damage: ${damage}\nStamina: ${move.cost}\nACC/CRIT: ${move.accuracy}%/${move.crit}%`;
    details.append(moveName, moveStats);
    const cost = document.createElement("small");
    cost.className = "move-dock-cost";
    cost.textContent = String(move.cost);
    button.append(glyph, details, cost);
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
  const move = MOVE_DATA.find(item => item.id === moveId);
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
  if (unit.team === "hero") return;

  // Choose a move first, then tap the enemy to execute it.
  if (!currentActor || currentActor.team !== "hero" || waitingForEnemy) return;
  selectedTargetId = unit.id;
  if (pendingMoveId) {
    const moveId = pendingMoveId;
    pendingMoveId = null;
    useMove(moveId, unit);
    return;
  }
  renderAll();
}

/* =========================================
   TURN SYSTEM
   ========================================= */

function startRound() {
  if (battleOver) return;

  initiative = [...heroes, ...enemies]
    .filter(unit => unit.alive)
    .map(unit => ({
      id: unit.id,
      score: unit.eva + Math.random() * 100
    }))
    .sort((a, b) => b.score - a.score)
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
  const move = MOVE_DATA.find(m => m.id === animatingMoveId);
  const isMelee = !move || move.attackType !== "ranged-gun";
  const travel = isMelee ? Math.min(distance * 0.72, Math.max(40, distance - Math.min(targetRect.width * 0.42, 70))) : 0;
  const x = dx / distance * travel;
  const y = dy / distance * travel;

  actorCard.style.setProperty("--attack-x", `${x}px`);
  actorCard.style.setProperty("--attack-y", `${y}px`);
  actorCard.style.setProperty("--target-x", `${dx}px`);
  actorCard.style.setProperty("--target-y", `${dy}px`);
}

function triggerCombatAnimation(actor, target, move) {
  animatingActorId = actor.id;
  animatingTargetId = target.id;
  animatingMoveId = move ? move.id : null;
  const token = ++animationToken;

  window.setTimeout(() => {
    if (token !== animationToken) return;
    animatingActorId = null;
    animatingTargetId = null;
    animatingMoveId = null;
    renderAll();
  }, 1280);
}

function showDamageNumber(target, amount, critical = false, missed = false, delay = 80) {
  // On mobile, centralize combat feedback above the VS marker so it is never
  // hidden by the narrow battlefield columns. Desktop keeps feedback by target.
  window.setTimeout(() => {
    const number = document.createElement("span");
    number.className = "damage-number damage-overlay" + (critical ? " critical" : "") + (missed ? " miss-number" : "");
    number.textContent = missed ? "DODGE" : String(Math.round(amount));
    number.setAttribute("aria-hidden", "true");

    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.3;
    if (window.matchMedia("(max-width: 760px)").matches) {
      const vs = document.querySelector(".battle-divider span");
      if (vs) {
        const rect = vs.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = Math.max(8, rect.top - 34);
      }
    } else {
      const card = document.querySelector(`.unit[data-unit-id="${target.id}"]`);
      if (card) {
        const rect = card.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = Math.max(16, rect.top + rect.height * 0.32);
      }
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
  if (
    battleOver ||
    waitingForEnemy ||
    !currentActor ||
    currentActor.team !== "hero" ||
    !currentActor.alive
  ) {
    return;
  }

  const actor = currentActor;
  const move = MOVE_DATA.find(m => m.id === moveId);
  const target = chosenTarget && chosenTarget.alive
    ? chosenTarget
    : enemies.find(e => e.id === selectedTargetId && e.alive);

  if (!move || !target) {
    log("Select a living enemy first.", "miss");
    return;
  }

  if (actor.sta < move.cost) {
    log(`${actor.name} doesn't have enough stamina.`, "miss");
    return;
  }

  if ((actor.cooldowns[move.id] || 0) > 0) {
    log(`${move.name} is still on cooldown.`, "miss");
    return;
  }

  actor.sta -= move.cost;
  pendingMoveId = null;
  selectedTargetId = target.id;
  triggerCombatAnimation(actor, target, move);

  if (move.type === "debuff") {
    useWidowmaker(actor, target, move);
  } else {
    performAttack(actor, target, move);
  }

  renderAll();

  if (checkBattleEnd()) return;

  turnIndex++;
  window.setTimeout(nextTurn, 1550);
}

function useWidowmaker(actor, target, move) {
  target.attackDebuffTurns = 1;
  target.atk = target.baseAtk * 0.5;

  actor.stunPrimed = true;
  actor.cooldowns[move.id] = move.cooldown;

  log(
    `${actor.name} uses Widowmaker! ${target.name}'s Attack is reduced by 50% until their next action.`,
    "good"
  );

  log(
    `${actor.name}'s next attack has a 75% chance to stun its target.`
  );
}

function performAttack(actor, target, move) {
  log(`${actor.name} uses ${move.name} on ${target.name}.`);

  for (let hitNumber = 1; hitNumber <= move.hits; hitNumber++) {
    if (!target.alive || !actor.alive) break;

    const hitChance = move.accuracy / 100;

    if (Math.random() > hitChance) {
      log(`${move.name} misses ${target.name}!`, "miss");
      showDamageNumber(target, 0, false, true, 80 + (hitNumber - 1) * 480);
      continue;
    }

    const damage = calculateDamage(actor, target, move);
    target.hp = Math.max(0, target.hp - damage.amount);

    const critical = damage.critical;
    showDamageNumber(target, damage.amount, critical, false, 80 + (hitNumber - 1) * 480);
    log(
      `${critical ? "CRITICAL! " : ""}${target.name} takes ${damage.amount} damage.`,
      "damage"
    );

    if (actor.stunPrimed) {
      actor.stunPrimed = false;

      if (Math.random() < 0.75 && target.alive) {
        target.stunned = true;
        log(`${target.name} is stunned and will lose their next action!`, "good");
      } else {
        log("The stun attempt fails.");
      }
    }

    if (target.hp <= 0) {
      target.alive = false;
      target.hp = 0;
      log(`${target.name} has been defeated!`, "good");
    }
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
    move.type === "attack" &&
    actor.sta >= move.cost &&
    (actor.cooldowns[move.id] || 0) === 0
  );

  if (availableMoves.length === 0) {
    log(`${actor.name} has insufficient stamina and skips their attack.`);
  } else {
    // Hydra chooses an affordable attack, favoring stronger moves.
    const move = availableMoves[
      Math.floor(Math.random() * availableMoves.length)
    ];

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
  const move = MOVE_DATA.find(item => item.id === inspectedMoveId);
  const actor = currentActor;
  if (!move || !actor || actor.team !== "hero" || !actor.alive || battleOver || waitingForEnemy) return;
  const cooldown = actor.cooldowns[move.id] || 0;
  if (actor.sta < move.cost || cooldown > 0) return;
  pendingMoveId = move.id;
  closeMoveInfo();
  renderAll();
  log(`${move.name} selected. Now select a Hydra target.`, "good");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !$("moveInfoOverlay").classList.contains("hidden")) closeMoveInfo();
});
$("playAgainBtn").addEventListener("click", resetBattle);

$("clearLogBtn").addEventListener("click", () => {
  $("battleLog").innerHTML = "";
});

resetBattle();
