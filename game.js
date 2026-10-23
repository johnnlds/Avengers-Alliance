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
  applyCombatAnimationPath();

  $("heroCount").textContent =
    `${heroes.filter(u => u.alive).length} ACTIVE`;

  $("enemyCount").textContent =
    `${enemies.filter(u => u.alive).length} ACTIVE`;

  $("roundLabel").textContent = `ROUND ${round}`;

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

    const healthTrack = document.createElement("div");
    healthTrack.className = "unit-health-track" + (currentActor?.id === unit.id ? " active-turn-bar" : "");
    healthTrack.setAttribute("aria-label", "Health");
    const healthFill = document.createElement("div");
    healthFill.className = "unit-health-fill";
    healthFill.style.width = `${Math.max(0, unit.hp / unit.maxHp * 100)}%`;
    healthTrack.appendChild(healthFill);

    card.append(portrait, name, healthTrack, status);

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

function renderCombatPanel() {
  const actor = currentActor;
  const hero = actor && actor.team === "hero" ? actor : null;
  const list = $("abilityList");
  list.innerHTML = "";

  if (!hero || !hero.alive) {
    list.innerHTML = '<p class="no-moves">Waiting for your next turn…</p>';
  } else {
    for (const move of MOVE_DATA) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "ability-card" + (pendingMoveId === move.id ? " chosen-ability" : "");
      const cooldown = hero.cooldowns[move.id] || 0;
      const affordable = hero.sta >= move.cost;
      const disabled = battleOver || waitingForEnemy || !affordable || cooldown > 0;

      const title = document.createElement("strong");
      title.className = "ability-name";
      title.textContent = move.name;

      const description = document.createElement("span");
      description.className = "ability-description";
      description.textContent = move.description;

      const cost = document.createElement("span");
      cost.className = "ability-cost";
      cost.textContent = cooldown > 0
        ? `Cooldown: ${cooldown} turn(s)`
        : `${move.cost} stamina`;

      card.append(title, description, cost);
      card.disabled = disabled;
      if (disabled) {
        card.title = cooldown > 0 ? `On cooldown for ${cooldown} more turn(s)` : !affordable ? "Not enough stamina" : "Unavailable";
      } else {
        card.addEventListener("click", () => {
          if (!enemies.some(e => e.alive)) {
            log("No living Hydra targets remain.", "miss");
            return;
          }
          pendingMoveId = move.id;
          renderCombatPanel();
          log(`${move.name} selected. Now select a Hydra target.`, "good");
        });
      }
      list.appendChild(card);
    }
  }

  $("endTurnBtn").disabled =
    battleOver ||
    waitingForEnemy ||
    !actor ||
    actor.team !== "hero";

  $("endTurnBtn").style.opacity =
    $("endTurnBtn").disabled ? "0.5" : "1";
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

    $("turnLabel").textContent = "YOUR TURN";
    $("turnLabel").style.color = "var(--green)";
    renderAll();
    log(`${unit.name}'s turn.`);
  } else {
    $("turnLabel").textContent = "HYDRA TURN";
    $("turnLabel").style.color = "var(--red)";
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

function showDamageNumber(target, amount, critical = false, missed = false) {
  // Rendering rebuilds the unit cards after damage is applied, so attach the
  // floating number on the next frame to ensure it stays visible.
  window.setTimeout(() => {
    const card = document.querySelector(`.unit[data-unit-id="${target.id}"]`);
    if (!card) return;
    const number = document.createElement("span");
    number.className = `damage-number ${target.team === "enemy" ? "damage-left" : "damage-right"}${critical ? " critical" : ""}${missed ? " miss-number" : ""}`;
    number.textContent = missed ? "DODGE" : String(Math.round(amount));
    number.setAttribute("aria-hidden", "true");
    card.appendChild(number);
    window.setTimeout(() => number.remove(), 950);
  }, 80);
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
      showDamageNumber(target, 0, false, true);
      continue;
    }

    const damage = calculateDamage(actor, target, move);
    target.hp = Math.max(0, target.hp - damage.amount);

    const critical = damage.critical;
    showDamageNumber(target, damage.amount, critical);
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

  $("turnLabel").textContent = "BATTLE OVER";
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
$("playAgainBtn").addEventListener("click", resetBattle);

$("clearLogBtn").addEventListener("click", () => {
  $("battleLog").innerHTML = "";
});

resetBattle();
