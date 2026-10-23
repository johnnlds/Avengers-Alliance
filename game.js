(() => {
  "use strict";

  // v2 deliberately starts a fresh save because the roster and move data have changed.
  const SAVE_KEY = "allianceProtocolBattle_v2";
  const HERO_DATA = {
    agent: {
      id: "agent", name: "S.H.I.E.L.D. Agent", role: "Tactical Operative", initials: "AG", portrait: "agent",
      maxHp: 110, attack: 15, defense: 3, wikiStats: null, abilities: "Field operative; adaptable support.",
      moves: [
        { id: "precision", name: "Precision Shot", type: "damage", power: 24, accuracy: .95, target: "enemy", desc: "A reliable single-target shot." },
        { id: "suppress", name: "Suppressing Fire", type: "damage", power: 15, accuracy: .9, target: "enemy", desc: "Deal damage and weaken the target.", effect: { kind: "weaken", turns: 2 } },
        { id: "field-kit", name: "Field Dressing", type: "heal", power: 22, target: "ally", desc: "Restore health to one ally." }
      ]
    },
    cap: {
      id: "cap", name: "Captain America", role: "Vanguard", initials: "CA", portrait: "cap",
      maxHp: 135, attack: 18, defense: 7, wikiStats: null, abilities: "Vanguard; protects allies and hits hard.",
      moves: [
        { id: "shield-strike", name: "Shield Strike", type: "damage", power: 28, accuracy: .95, target: "enemy", desc: "A powerful shield-assisted attack." },
        { id: "rally", name: "Rallying Defense", type: "guard", power: 0, target: "ally", desc: "Reduce the next hit against an ally.", effect: { kind: "guard", turns: 1 } },
        { id: "ricochet", name: "Shield Ricochet", type: "damage", power: 20, accuracy: .9, target: "enemy", desc: "Strike a target with a fast shield throw." }
      ]
    },
    iron: {
      id: "iron", name: "Iron Man", role: "Heavy Support", initials: "IM", portrait: "iron",
      maxHp: 105, attack: 22, defense: 2, wikiStats: null, abilities: "Heavy support; powerful ranged attacks.",
      moves: [
        { id: "repulsor", name: "Repulsor Blast", type: "damage", power: 30, accuracy: .9, target: "enemy", desc: "Focused energy blast with high damage." },
        { id: "unibeam", name: "Unibeam", type: "damage", power: 43, accuracy: .78, target: "enemy", desc: "Heavy damage, but less reliable." },
        { id: "overcharge", name: "Overcharge", type: "buff", power: 0, target: "self", desc: "Boost Iron Man's next attack.", effect: { kind: "buff", turns: 2 } }
      ]
    },
    "black-bolt": {
      id: "black-bolt", name: "Black Bolt", role: "Inhuman King", initials: "BB", portrait: "black-bolt",
      maxHp: 124, attack: 23, defense: 5,
      wikiStats: { health: 6438, stamina: 7153, attack: 1574, defense: 1288, accuracy: 1574, evasion: 1431, uniform: "Classic" },
      abilities: "Electron Harnessing; Flying; King of the Inhumans. Detailed passive mechanics are not fully verified.",
      moves: [
        { id: "kingly-fists", name: "Kingly Fists", type: "damage", power: 34, accuracy: .92, target: "enemy", hits: 2, wikiDamage: "914–1186", staminaCost: "10%", crit: "16%", unlock: 1, wikiType: "Melee Unarmed", properties: "Deadly Crits; Ambient Particles", status: "None", duration: "None", desc: "Two-hit melee attack. Wiki damage: 914–1186 (Agent Level 300)." },
        { id: "royal-flight", name: "Royal Flight", type: "damage", power: 25, accuracy: .92, target: "enemy", cooldown: "2 rounds", wikiDamage: "665–798", staminaCost: "15%", crit: "16%", unlock: 2, wikiType: "Melee Unarmed", properties: "Ambient Particles; Kree Speed", status: "Off-balance; Kree Speed", duration: "1 round; expires next round", desc: "Attack with additional effects. Wiki damage: 665–798 (Agent Level 300).", effect: { kind: "weaken", turns: 1 } },
        { id: "whisper", name: "Whisper", type: "damage", power: 23, accuracy: 1, target: "allEnemies", cooldown: "2 rounds", wikiDamage: "553–772", staminaCost: "35%", crit: "18%", unlock: 6, wikiType: "Ranged Sonic", properties: "Catastrophic", status: "Incapacitation; Buff Blocker", duration: "2 rounds; 1 round (50% chance)", desc: "Sonic attack against all enemies. Wiki damage: 553–772 (Agent Level 300).", effect: { kind: "weaken", turns: 1 } },
        { id: "power-word", name: "Power Word", type: "damage", power: 52, accuracy: 1, target: "enemy", cooldown: "3 rounds; starts cooled down", wikiDamage: "1594–2072", staminaCost: "30%", crit: "30%", unlock: 9, wikiType: "Ranged Sonic", properties: "Catastrophic; Brutal Strike; Ignore Defense; Particle Manipulation", status: "None", duration: "None", desc: "High-power sonic attack. Wiki damage: 1594–2072 (Agent Level 300)." }
      ]
    },
    "black-panther": {
      id: "black-panther", name: "Black Panther", role: "Wakandan King", initials: "BP", portrait: "black-panther",
      maxHp: 120, attack: 21, defense: 6,
      wikiStats: { health: 7153, stamina: 7868, attack: 1288, defense: 1288, accuracy: 1431, evasion: 1717, uniform: "Classic" },
      abilities: "Woven Vibranium. Exact uniform passive mechanics need further verification.",
      moves: [
        { id: "anti-metal-claws", name: "Anti-metal Claws", type: "damage", power: 25, accuracy: .94, target: "enemy", hits: 2, wikiDamage: "674–740", staminaCost: "11%", crit: "12%", unlock: 1, wikiType: "Vibranium Slashing Melee", properties: "Ethereal Strike; Ignore Defense", status: "Bleeding; Heart of the Panther", duration: "3 rounds; 2 rounds", desc: "Two-hit claw attack. Wiki damage: 674–740 (Agent Level 300).", effect: { kind: "bleed", turns: 2 } },
        { id: "wakandan-arts", name: "Wakandan Arts", type: "damage", power: 37, accuracy: .74, target: "enemy", hits: 2, wikiDamage: "1042–1456", staminaCost: "18%", crit: "9%", unlock: 2, wikiType: "Unarmed Melee", properties: "Exploits Bleeds", status: "Eye of the Panther", duration: "2 rounds", desc: "Two-hit melee attack; stronger against bleeding targets. Wiki damage: 1042–1456 (Agent Level 300).", effect: { kind: "bonusVsBleed", turns: 2 } },
        { id: "panther-stance", name: "Panther Stance", type: "buff", power: 0, target: "self", cooldown: "3 rounds", wikiDamage: "N/A", staminaCost: "7%", unlock: 6, wikiType: "Buff", properties: "Free Action", status: "Panther Stance; Rage of the Panther; Guile of the Panther", duration: "2 rounds; expires next round", desc: "Enter a defensive stance. Game effect: reduce the next incoming hit.", effect: { kind: "guard", turns: 1 } },
        { id: "vibranium-daggers", name: "Vibranium Daggers", type: "damage", power: 27, accuracy: .88, target: "enemy", wikiDamage: "712–925", staminaCost: "15%", crit: "11%", unlock: 9, cooldown: "1 round", wikiType: "Slashing Vibranium Ranged", properties: "Ethereal Strike; Remove Buffs", status: "Short Circuit", duration: "1 turn", desc: "Ranged dagger attack. Wiki damage: 712–925 (Agent Level 300).", effect: { kind: "removeBuffs", turns: 1 } }
      ]
    }
  };

  const makeHero = (key) => {
    const base = HERO_DATA[key];
    return { ...base, moves: base.moves.map(m => ({ ...m })), hp: base.maxHp };
  };
  const originalState = () => ({
    turn: 1, phase: "heroes", status: "active", selectedHeroId: "agent", selectedMoveId: null,
    targeting: false, _acted: [],
    slotTwo: "cap", slotThree: "iron",
    log: ["Mission started. Three Alliance operatives deployed against three HYDRA agents."],
    heroes: [makeHero("agent"), makeHero("cap"), makeHero("iron")],
    enemies: [
      { id: "hydra1", name: "HYDRA Agent", role: "Assault", initials: "H1", portrait: "hydra", maxHp: 78, hp: 78, attack: 13, defense: 1, moves: [{ id: "rifle", name: "Rifle Burst", power: 14 }] },
      { id: "hydra2", name: "HYDRA Agent", role: "Rifleman", initials: "H2", portrait: "hydra", maxHp: 78, hp: 78, attack: 13, defense: 1, moves: [{ id: "rifle", name: "Rifle Burst", power: 14 }] },
      { id: "hydra3", name: "HYDRA Agent", role: "Heavy", initials: "H3", portrait: "hydra", maxHp: 90, hp: 90, attack: 15, defense: 2, moves: [{ id: "heavy-shot", name: "Heavy Shot", power: 17 }] }
    ], effects: {}, moveCooldowns: {}
  });

  let state = loadState() || originalState();
  const $ = (id) => document.getElementById(id);
  const alive = (unit) => unit.hp > 0;
  const heroesAlive = () => state.heroes.filter(alive);
  const enemiesAlive = () => state.enemies.filter(alive);
  const allUnits = () => [...state.heroes, ...state.enemies];
  const findUnit = (id) => allUnits().find(u => u.id === id);
  const selectedHero = () => findUnit(state.selectedHeroId) || heroesAlive()[0] || state.heroes[0];

  function loadState() {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (!parsed || !Array.isArray(parsed.heroes) || !Array.isArray(parsed.enemies) || !parsed.slotTwo || !parsed.slotThree) return null;
      // Refresh move definitions from this code version while preserving HP/progress.
      parsed.heroes = parsed.heroes.map(old => {
        const key = old.id === "cap" || old.id === "black-bolt" ? parsed.slotTwo : old.id === "iron" || old.id === "black-panther" ? parsed.slotThree : "agent";
        const current = makeHero(key);
        return { ...current, hp: Math.min(current.maxHp, old.hp ?? current.maxHp) };
      });
      parsed._acted = parsed._acted || [];
      parsed.effects = parsed.effects || {};
      parsed.moveCooldowns = parsed.moveCooldowns || {};
      return parsed;
    } catch (err) { console.warn("Could not load save:", err); return null; }
  }

  function saveState(showMessage = false) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      $("save-status").textContent = "Saved locally at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ".";
      if (showMessage) message("Battle saved in this browser.");
    } catch (err) { $("save-status").textContent = "Could not save. Browser storage may be unavailable."; }
  }
  function message(text) { $("battle-message").textContent = text; }
  function addLog(text) { state.log.unshift(text); state.log = state.log.slice(0, 18); }
  function escapeHtml(str) { return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function unitCard(unit, side) {
    const dead = !alive(unit);
    const selected = side === "hero" && unit.id === state.selectedHeroId && state.phase === "heroes" && state.status === "active";
    const targeting = state.targeting && state.selectedMoveId && alive(unit) && ((side === "enemy" && selectedHero().moves.find(m => m.id === state.selectedMoveId)?.target === "enemy") || (side === "hero" && selectedHero().moves.find(m => m.id === state.selectedMoveId)?.target === "ally"));
    const pct = Math.max(0, Math.round(unit.hp / unit.maxHp * 100));
    return `<article class="unit-card ${side === "enemy" ? "enemy" : ""} ${dead ? "dead" : ""} ${selected ? "selected" : ""} ${targeting ? "targeting" : ""} ${pct <= 30 ? "low-health" : ""}" data-unit-id="${unit.id}" data-side="${side}" tabindex="${dead ? -1 : 0}" role="button" aria-label="${unit.name}, ${unit.hp} health">
      <div class="unit-topline"><div><h3 class="unit-name">${unit.name}</h3><div class="unit-class">${unit.role}</div></div></div>
      <div class="portrait unit-portrait portrait-${unit.portrait}"><span>${unit.initials}</span></div>
      <div class="health-row"><span>HEALTH</span><strong>${unit.hp} / ${unit.maxHp}</strong></div><div class="health-track"><div class="health-fill" style="width:${pct}%"></div></div>
      <div class="unit-stats"><span>ATK <strong>${unit.attack}</strong></span><span>DEF <strong>${unit.defense}</strong></span></div>
      ${unit.wikiStats ? `<div class="wiki-stat-mini">WIKI ATK ${unit.wikiStats.attack} · DEF ${unit.wikiStats.defense}</div>` : ""}</article>`;
  }
  function renderTeams() {
    $("hero-team").innerHTML = state.heroes.map(u => unitCard(u, "hero")).join("");
    $("enemy-team").innerHTML = state.enemies.map(u => unitCard(u, "enemy")).join("");
    document.querySelectorAll("[data-unit-id]").forEach(card => {
      const activate = () => handleUnitClick(card.dataset.unitId, card.dataset.side);
      card.addEventListener("click", activate);
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } });
    });
  }
  function renderCommands() {
    const hero = selectedHero();
    $("selected-name").textContent = hero.name;
    $("selected-description").textContent = hero.hp <= 0 ? "This operative is down. Select another hero." : `${descriptionFor(hero)}${hero.wikiStats ? ` Wiki base (${hero.wikiStats.uniform}): HP ${hero.wikiStats.health}, STA ${hero.wikiStats.stamina}, ATK ${hero.wikiStats.attack}, DEF ${hero.wikiStats.defense}, ACC ${hero.wikiStats.accuracy}, EVA ${hero.wikiStats.evasion}. Abilities: ${hero.abilities}` : ` Abilities: ${hero.abilities}`}`;
    $("selected-avatar").className = `portrait large portrait-${hero.portrait}`;
    $("selected-avatar").innerHTML = `<span>${hero.initials}</span>`;
    $("action-hint").textContent = state.status !== "active" ? "Battle concluded." : state.phase !== "heroes" ? "Enemy phase in progress." : state.targeting ? "Choose a highlighted target." : "Choose an action, then a target.";
    const disabled = state.status !== "active" || state.phase !== "heroes" || !alive(hero) || state._acted.includes(hero.id);
    $("move-list").innerHTML = hero.moves.map(move => {
      const active = state.selectedMoveId === move.id;
      const targetLabel = move.target === "enemy" ? "ENEMY TARGET" : move.target === "allEnemies" ? "ALL ENEMIES" : move.target === "ally" ? "ALLY TARGET" : "SELF";
      const typeLabel = move.type === "heal" ? "SUPPORT" : ["guard", "buff"].includes(move.type) ? "TACTICAL" : "ATTACK";
      const detail = [move.unlock ? `Unlock Lv. ${move.unlock}` : "", move.staminaCost ? `Stamina ${move.staminaCost}` : "", move.wikiDamage ? `Wiki damage ${move.wikiDamage}` : "", move.accuracy !== undefined && move.wikiDamage ? `Hit ${Math.round(move.accuracy * 100)}%` : "", move.crit ? `Crit ${move.crit}` : "", move.cooldown ? `Cooldown ${move.cooldown}` : "", move.wikiType ? `Type: ${move.wikiType}` : "", move.status && move.status !== "None" ? `Effects: ${move.status}` : "", move.duration && move.duration !== "None" ? `Duration: ${move.duration}` : ""].filter(Boolean).join(" · ");
      return `<button class="move-button ${active ? "active" : ""}" data-move-id="${move.id}" ${disabled ? "disabled" : ""}><span class="move-name">${move.name}</span><span class="move-meta"><span>${typeLabel}</span><span>${targetLabel}</span></span><span class="move-desc">${move.desc}</span>${detail ? `<span class="move-wiki-detail">${detail}</span>` : ""}${move.properties ? `<span class="move-wiki-detail">Properties: ${move.properties}</span>` : ""}</button>`;
    }).join("");
    document.querySelectorAll("[data-move-id]").forEach(btn => btn.addEventListener("click", () => chooseMove(btn.dataset.moveId)));
    $("turn-count").textContent = String(state.turn).padStart(2, "0");
    $("battle-status").textContent = state.status.toUpperCase();
    $("slot-two-select").value = state.slotTwo;
    $("slot-three-select").value = state.slotThree;
    $("slot-two-select").disabled = state.status !== "active" || state.phase !== "heroes";
    $("slot-three-select").disabled = state.status !== "active" || state.phase !== "heroes";
  }
  function descriptionFor(hero) {
    if (hero.id === "agent") return "A versatile field operative. Adapt to the changing fight.";
    if (hero.id === "cap") return "The team's vanguard. Protect allies and hit hard.";
    if (hero.id === "iron") return "Heavy support. High damage with a little less accuracy.";
    if (hero.id === "black-bolt") return "The Inhuman king, with devastating sonic attacks.";
    if (hero.id === "black-panther") return "Wakanda's king: agile, precise, and equipped with vibranium weapons.";
    return hero.role;
  }
  function renderLog() { $("combat-log").innerHTML = state.log.map((line, i) => `<li><span class="log-turn">${i === 0 ? "NOW" : "LOG"}</span>${escapeHtml(line)}</li>`).join(""); }
  function render() { renderTeams(); renderCommands(); renderLog(); $("restart-button").disabled = false; saveState(false); }

  function swapSlot(slot, key) {
    if (state.status !== "active" || state.phase !== "heroes") return;
    const index = slot === 2 ? 1 : 2;
    const old = state.heroes[index];
    if (old.id === key) return;
    state.heroes[index] = makeHero(key);
    if (state.selectedHeroId === old.id) state.selectedHeroId = state.heroes[index].id;
    state._acted = state._acted.filter(id => id !== old.id);
    state.selectedMoveId = null; state.targeting = false;
    if (slot === 2) state.slotTwo = key; else state.slotThree = key;
    addLog(`${state.heroes[index].name} joined the active roster in slot ${slot}.`);
    message(`${state.heroes[index].name} selected for slot ${slot}.`);
    render();
  }

  function chooseMove(moveId) {
    if (state.status !== "active" || state.phase !== "heroes") return;
    const actor = selectedHero();
    if (!alive(actor) || state._acted.includes(actor.id)) { message(`${actor.name} has already acted this round. Select another operative.`); return; }
    const move = actor.moves.find(m => m.id === moveId);
    if (!move) return;
    state.selectedMoveId = move.id;
    if (move.target === "self") { executeMove(actor, actor, move); return; }
    state.targeting = true;
    if (move.target === "allEnemies") { executeMove(actor, enemiesAlive()[0], move); return; }
    const candidates = move.target === "ally" ? heroesAlive() : enemiesAlive();
    message(`${actor.name}: ${move.name}. Select ${move.target === "ally" ? "an ally" : "a HYDRA target"}.`);
    if (!candidates.length) { state.targeting = false; state.selectedMoveId = null; }
    render();
  }
  function handleUnitClick(unitId, side) {
    if (state.status !== "active" || state.phase !== "heroes") return;
    const unit = findUnit(unitId);
    if (!unit || !alive(unit)) return;
    if (state.targeting && state.selectedMoveId) {
      const actor = selectedHero();
      const move = actor.moves.find(m => m.id === state.selectedMoveId);
      if (move && move.target === "ally" && side === "hero") { executeMove(actor, unit, move); return; }
      if (move && move.target === "enemy" && side === "enemy") { executeMove(actor, unit, move); return; }
    }
    if (side === "hero") {
      state.selectedHeroId = unitId; state.selectedMoveId = null; state.targeting = false;
      message(state._acted.includes(unitId) ? `${unit.name} has already acted this round. Choose another operative.` : `${unit.name} selected. Choose an action.`);
      render();
    } else message("Choose one of your heroes, then select an action.");
  }

  function executeMove(actor, target, move) {
    if (!alive(actor) || state.status !== "active" || state._acted.includes(actor.id)) return;
    const targets = move.target === "allEnemies" ? enemiesAlive() : [target].filter(Boolean);
    if (!targets.length || targets.some(t => !alive(t))) return;
    let logLine = "";
    if (move.type === "damage") {
      const hitTargets = move.target === "allEnemies" ? targets : targets;
      let total = 0;
      const results = [];
      const buff = state.effects[`${actor.id}:buff`]?.turns > 0 ? 12 : 0;
      for (const victim of hitTargets) {
        if (Math.random() > (move.accuracy ?? 1)) { results.push(`${victim.name} dodged`); continue; }
        const weakened = state.effects[`${victim.id}:weaken`]?.turns > 0 ? 5 : 0;
        const bonus = move.effect?.kind === "bonusVsBleed" && state.effects[`${victim.id}:bleed`]?.turns > 0 ? 12 : 0;
        const hits = move.hits || 1;
        const raw = Math.max(5, move.power + actor.attack * .35 + buff + bonus - victim.defense - weakened);
        const damage = Math.round(raw * (hits > 1 ? 1.15 : 1));
        victim.hp = Math.max(0, victim.hp - damage); total += damage;
        results.push(`${victim.name} ${damage} damage${victim.hp === 0 ? " (defeated)" : ""}`);
        if (move.effect?.kind === "weaken" && victim.hp > 0) state.effects[`${victim.id}:weaken`] = { kind: "weaken", turns: move.effect.turns || 1 };
        if (move.effect?.kind === "bleed" && victim.hp > 0) state.effects[`${victim.id}:bleed`] = { kind: "bleed", turns: move.effect.turns || 2 };
        if (move.effect?.kind === "removeBuffs") {
          for (const key of Object.keys(state.effects)) if (key.startsWith(`${victim.id}:`) && !key.endsWith(":weaken") && !key.endsWith(":bleed")) delete state.effects[key];
        }
      }
      if (buff) delete state.effects[`${actor.id}:buff`];
      logLine = `${actor.name} used ${move.name}: ${results.join("; ")}.`;
    } else if (move.type === "heal") {
      const before = target.hp; target.hp = Math.min(target.maxHp, target.hp + move.power);
      logLine = `${actor.name} used ${move.name} on ${target.name}, restoring ${target.hp - before} health.`;
    } else if (move.type === "guard" || move.effect?.kind === "guard") {
      state.effects[`${target.id}:guard`] = { kind: "guard", turns: move.effect?.turns || 1 };
      logLine = `${actor.name} used ${move.name}. ${target.name} is guarded against the next attack.`;
    } else if (move.type === "buff") {
      state.effects[`${actor.id}:buff`] = { kind: "buff", turns: move.effect?.turns || 2 };
      logLine = `${actor.name} activated ${move.name}. Their next attack gains bonus damage.`;
    }
    addLog(logLine);
    state.selectedMoveId = null; state.targeting = false;
    if (checkBattleEnd()) { render(); message(state.status === "victory" ? "Victory! HYDRA has been driven from the outpost." : "Defeat. Your team has been incapacitated."); saveState(); return; }
    state._acted.push(actor.id);
    const remaining = heroesAlive().filter(h => !state._acted.includes(h.id));
    if (!remaining.length) {
      state.phase = "enemies"; render(); message("HYDRA forces are taking their turn..."); saveState(); window.setTimeout(enemyTurn, 550);
    } else {
      state.selectedHeroId = remaining[0].id;
      message(`${actor.name} acted. ${remaining[0].name}, choose an action.`);
      render();
    }
  }

  function enemyTurn() {
    if (state.status !== "active") return;
    for (const enemy of enemiesAlive()) {
      const targets = heroesAlive(); if (!targets.length) break;
      const target = targets[Math.floor(Math.random() * targets.length)];
      const guardKey = `${target.id}:guard`;
      let damage = Math.max(4, enemy.moves[0].power + enemy.attack * .3 - target.defense);
      if (state.effects[guardKey]) { damage = Math.max(1, Math.round(damage * .45)); delete state.effects[guardKey]; }
      target.hp = Math.max(0, target.hp - Math.round(damage));
      addLog(`${enemy.name} attacked ${target.name} for ${Math.round(damage)} damage${target.hp === 0 ? " — operative down!" : "."}`);
      if (checkBattleEnd()) break;
    }
    if (state.status === "active") {
      for (const key of Object.keys(state.effects)) {
        if (state.effects[key]?.turns > 0) state.effects[key].turns--;
        if (state.effects[key]?.turns <= 0) delete state.effects[key];
      }
      state.turn += 1; state.phase = "heroes"; state._acted = [];
      if (!alive(findUnit(state.selectedHeroId))) state.selectedHeroId = heroesAlive()[0]?.id || state.heroes[0].id;
      message("Your turn. Select an operative and choose an action.");
    } else message(state.status === "victory" ? "Victory! HYDRA has been driven from the outpost." : "Defeat. Your team has been incapacitated.");
    render();
  }
  function checkBattleEnd() {
    if (enemiesAlive().length === 0) { state.status = "victory"; state.phase = "ended"; state._acted = []; return true; }
    if (heroesAlive().length === 0) { state.status = "defeat"; state.phase = "ended"; state._acted = []; return true; }
    return false;
  }

  $("slot-two-select").addEventListener("change", e => swapSlot(2, e.target.value));
  $("slot-three-select").addEventListener("change", e => swapSlot(3, e.target.value));
  $("save-button").addEventListener("click", () => saveState(true));
  $("restart-button").addEventListener("click", () => {
    if (!confirm("Restart this battle from the beginning? Your current battle save will be replaced.")) return;
    state = originalState(); saveState(); render(); message("Fresh battle started. Select a hero to begin.");
  });
  if (state.phase === "enemies" && state.status === "active") { state.phase = "heroes"; state._acted = []; state.targeting = false; state.selectedMoveId = null; }
  if (!state.heroes.some(alive) || !state.enemies.some(alive)) checkBattleEnd();
  render();
  if (state.status === "active" && !localStorage.getItem(SAVE_KEY)) message("Select a hero to begin your turn.");
})();
