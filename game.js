(() => {
  "use strict";

  const SAVE_KEY = "allianceProtocolBattle_v1";

  const originalState = () => ({
    turn: 1,
    phase: "heroes",
    status: "active",
    selectedHeroId: "agent",
    selectedMoveId: null,
    targeting: false,
    log: ["Mission started. Three Alliance operatives deployed against three HYDRA agents."],
    heroes: [
      { id: "agent", name: "S.H.I.E.L.D. Agent", role: "Tactical Operative", initials: "AG", portrait: "agent", maxHp: 110, hp: 110, attack: 15, defense: 3, moves: [
        { id: "precision", name: "Precision Shot", type: "damage", power: 24, accuracy: 0.95, target: "enemy", cost: 0, desc: "A reliable single-target shot." },
        { id: "suppress", name: "Suppressing Fire", type: "damage", power: 15, accuracy: 0.9, target: "enemy", cost: 0, desc: "Deal damage and weaken the target." , effect: { kind: "weaken", turns: 2 }},
        { id: "field-kit", name: "Field Dressing", type: "heal", power: 22, target: "ally", cost: 0, desc: "Restore health to one ally." }
      ]},
      { id: "cap", name: "Captain America", role: "Vanguard", initials: "CA", portrait: "cap", maxHp: 135, hp: 135, attack: 18, defense: 7, moves: [
        { id: "shield-strike", name: "Shield Strike", type: "damage", power: 28, accuracy: 0.95, target: "enemy", cost: 0, desc: "A powerful shield-assisted attack." },
        { id: "rally", name: "Rallying Defense", type: "guard", power: 0, target: "ally", cost: 0, desc: "Reduce the next hit against an ally.", effect: { kind: "guard", turns: 1 }},
        { id: "ricochet", name: "Shield Ricochet", type: "damage", power: 20, accuracy: 0.9, target: "enemy", cost: 0, desc: "Strike a target with a fast shield throw." }
      ]},
      { id: "iron", name: "Iron Man", role: "Heavy Support", initials: "IM", portrait: "iron", maxHp: 105, hp: 105, attack: 22, defense: 2, moves: [
        { id: "repulsor", name: "Repulsor Blast", type: "damage", power: 30, accuracy: 0.9, target: "enemy", cost: 0, desc: "Focused energy blast with high damage." },
        { id: "unibeam", name: "Unibeam", type: "damage", power: 43, accuracy: 0.78, target: "enemy", cost: 0, desc: "Heavy damage, but less reliable." },
        { id: "overcharge", name: "Overcharge", type: "buff", power: 0, target: "self", cost: 0, desc: "Boost Iron Man's next attack.", effect: { kind: "buff", turns: 2 }}
      ]}
    ],
    enemies: [
      { id: "hydra1", name: "HYDRA Agent", role: "Assault", initials: "H1", portrait: "hydra", maxHp: 78, hp: 78, attack: 13, defense: 1, moves: [{ id: "rifle", name: "Rifle Burst", power: 14 }] },
      { id: "hydra2", name: "HYDRA Agent", role: "Rifleman", initials: "H2", portrait: "hydra", maxHp: 78, hp: 78, attack: 13, defense: 1, moves: [{ id: "rifle", name: "Rifle Burst", power: 14 }] },
      { id: "hydra3", name: "HYDRA Agent", role: "Heavy", initials: "H3", portrait: "hydra", maxHp: 90, hp: 90, attack: 15, defense: 2, moves: [{ id: "heavy-shot", name: "Heavy Shot", power: 17 }] }
    ],
    effects: {}
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
      if (!parsed || !Array.isArray(parsed.heroes) || !Array.isArray(parsed.enemies)) return null;
      return parsed;
    } catch (err) {
      console.warn("Could not load save:", err);
      return null;
    }
  }

  function saveState(showMessage = false) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      $("save-status").textContent = "Saved locally at " + new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}) + ".";
      if (showMessage) message("Battle saved in this browser.");
    } catch (err) {
      $("save-status").textContent = "Could not save. Browser storage may be unavailable.";
    }
  }

  function message(text) {
    $("battle-message").textContent = text;
  }

  function addLog(text) {
    state.log.unshift(text);
    state.log = state.log.slice(0, 18);
  }

  function unitCard(unit, side) {
    const isDead = !alive(unit);
    const isSelected = side === "hero" && unit.id === state.selectedHeroId && state.phase === "heroes" && state.status === "active";
    const isTarget = state.targeting && side === "enemy" && state.selectedMoveId && alive(unit);
    const pct = Math.max(0, Math.round(unit.hp / unit.maxHp * 100));
    return `
      <article class="unit-card ${side === "enemy" ? "enemy" : ""} ${isDead ? "dead" : ""} ${isSelected ? "selected" : ""} ${isTarget ? "targeting" : ""} ${pct <= 30 ? "low-health" : ""}"
        data-unit-id="${unit.id}" data-side="${side}" tabindex="${isDead ? -1 : 0}" role="button" aria-label="${unit.name}, ${unit.hp} health">
        <div class="unit-topline"><div><h3 class="unit-name">${unit.name}</h3><div class="unit-class">${unit.role}</div></div></div>
        <div class="portrait unit-portrait portrait-${unit.portrait}"><span>${unit.initials}</span></div>
        <div class="health-row"><span>HEALTH</span><strong>${unit.hp} / ${unit.maxHp}</strong></div>
        <div class="health-track"><div class="health-fill" style="width:${pct}%"></div></div>
        <div class="unit-stats"><span>ATK <strong>${unit.attack}</strong></span><span>DEF <strong>${unit.defense}</strong></span></div>
      </article>`;
  }

  function renderTeams() {
    $("hero-team").innerHTML = state.heroes.map(u => unitCard(u, "hero")).join("");
    $("enemy-team").innerHTML = state.enemies.map(u => unitCard(u, "enemy")).join("");
    document.querySelectorAll("[data-unit-id]").forEach(card => {
      const activate = () => handleUnitClick(card.dataset.unitId, card.dataset.side);
      card.addEventListener("click", activate);
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }});
    });
  }

  function renderCommands() {
    const hero = selectedHero();
    $("selected-name").textContent = hero.name;
    $("selected-description").textContent = hero.hp <= 0 ? "This operative is down. Select another hero." : descriptionFor(hero);
    $("selected-avatar").className = `portrait large portrait-${hero.portrait}`;
    $("selected-avatar").innerHTML = `<span>${hero.initials}</span>`;
    $("action-hint").textContent = state.status !== "active" ? "Battle concluded." :
      state.phase !== "heroes" ? "Enemy phase in progress." :
      state.targeting ? "Choose a highlighted target." : "Choose an action, then a target.";

    const disabled = state.status !== "active" || state.phase !== "heroes" || !alive(hero);
    $("move-list").innerHTML = hero.moves.map(move => {
      const active = state.selectedMoveId === move.id;
      const targetLabel = move.target === "enemy" ? "ENEMY TARGET" : move.target === "ally" ? "ALLY TARGET" : "SELF";
      const typeLabel = move.type === "heal" ? "SUPPORT" : move.type === "guard" || move.type === "buff" ? "TACTICAL" : "ATTACK";
      return `<button class="move-button ${active ? "active" : ""}" data-move-id="${move.id}" ${disabled ? "disabled" : ""}>
        <span class="move-name">${move.name}</span>
        <span class="move-meta"><span>${typeLabel}</span><span>${targetLabel}</span></span>
        <span class="move-desc">${move.desc}</span>
      </button>`;
    }).join("");
    document.querySelectorAll("[data-move-id]").forEach(btn => btn.addEventListener("click", () => chooseMove(btn.dataset.moveId)));
    $("turn-count").textContent = String(state.turn).padStart(2, "0");
    $("battle-status").textContent = state.status.toUpperCase();
  }

  function descriptionFor(hero) {
    if (hero.id === "agent") return "A versatile field operative. Adapt to the changing fight.";
    if (hero.id === "cap") return "The team's vanguard. Protect allies and hit hard.";
    if (hero.id === "iron") return "Heavy support. High damage with a little less accuracy.";
    return hero.role;
  }

  function renderLog() {
    $("combat-log").innerHTML = state.log.map((line, i) => `<li><span class="log-turn">${i === 0 ? "NOW" : "LOG"}</span>${escapeHtml(line)}</li>`).join("");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function render() {
    renderTeams();
    renderCommands();
    renderLog();
    $("restart-button").disabled = false;
    saveState(false);
  }

  function chooseMove(moveId) {
    if (state.status !== "active" || state.phase !== "heroes") return;
    const hero = selectedHero();
    if (!alive(hero)) return;
    const move = hero.moves.find(m => m.id === moveId);
    if (!move) return;
    state.selectedMoveId = move.id;
    if (move.target === "self") {
      executeMove(hero, hero, move);
      return;
    }
    state.targeting = true;
    const candidates = move.target === "ally" ? heroesAlive() : enemiesAlive();
    message(`${hero.name}: ${move.name}. Select ${move.target === "ally" ? "an ally" : "a HYDRA target"}.`);
    if (!candidates.length) {
      state.targeting = false;
      state.selectedMoveId = null;
    }
    render();
  }

  function handleUnitClick(unitId, side) {
    if (state.status !== "active") return;
    const unit = findUnit(unitId);
    if (!unit || !alive(unit)) return;
    if (state.phase !== "heroes") return;

    if (side === "hero") {
      if (state.targeting && state.selectedMoveId) {
        const hero = selectedHero();
        const move = hero.moves.find(m => m.id === state.selectedMoveId);
        if (move && move.target === "ally") {
          executeMove(hero, unit, move);
          return;
        }
      }
      state.selectedHeroId = unitId;
      state.selectedMoveId = null;
      state.targeting = false;
      message(`${unit.name} selected. Choose an action.`);
      render();
      return;
    }

    if (state.targeting && state.selectedMoveId) {
      const hero = selectedHero();
      const move = hero.moves.find(m => m.id === state.selectedMoveId);
      if (move && move.target === "enemy") executeMove(hero, unit, move);
    } else {
      message("Choose one of your heroes, then select an action.");
    }
  }

  function executeMove(actor, target, move) {
    if (!alive(actor) || !alive(target) || state.status !== "active") return;
    const effectKey = `${actor.id}:${move.id}`;
    let line = "";

    if (move.type === "damage") {
      if (Math.random() > (move.accuracy ?? 1)) {
        line = `${actor.name} used ${move.name}, but missed ${target.name}.`;
      } else {
        const bonus = state.effects[effectKey]?.kind === "buff" ? 12 : 0;
        const weakened = state.effects[`${target.id}:weaken`]?.turns > 0 ? 5 : 0;
        const damage = Math.max(5, move.power + actor.attack * 0.35 + bonus - target.defense - weakened);
        target.hp = Math.max(0, target.hp - Math.round(damage));
        line = `${actor.name} used ${move.name} on ${target.name} for ${Math.round(damage)} damage${target.hp === 0 ? " — target defeated!" : "."}`;
        if (move.effect?.kind === "weaken" && target.hp > 0) {
          state.effects[`${target.id}:weaken`] = { kind: "weaken", turns: move.effect.turns };
          line += " Target weakened.";
        }
        if (bonus) delete state.effects[effectKey];
      }
    } else if (move.type === "heal") {
      const before = target.hp;
      target.hp = Math.min(target.maxHp, target.hp + move.power);
      line = `${actor.name} used ${move.name} on ${target.name}, restoring ${target.hp - before} health.`;
    } else if (move.type === "guard") {
      state.effects[`${target.id}:guard`] = { kind: "guard", turns: move.effect?.turns || 1 };
      line = `${actor.name} used ${move.name}. ${target.name} is guarded against the next attack.`;
    } else if (move.type === "buff") {
      state.effects[effectKey] = { kind: "buff", turns: move.effect?.turns || 2 };
      line = `${actor.name} activated ${move.name}. The next attack deals bonus damage.`;
    }

    addLog(line);
    state.selectedMoveId = null;
    state.targeting = false;
    if (checkBattleEnd()) {
      render();
      message(state.status === "victory" ? "Victory! HYDRA has been driven from the outpost." : "Defeat. Your team has been incapacitated.");
      saveState();
      return;
    }

    const nextHero = state.heroes.find(h => alive(h) && h.id !== actor.id && !state._acted?.includes(h.id));
    state._acted = state._acted || [];
    if (!state._acted.includes(actor.id)) state._acted.push(actor.id);
    if (state._acted.length >= heroesAlive().length || heroesAlive().every(h => state._acted.includes(h.id))) {
      state.phase = "enemies";
      render();
      message("HYDRA forces are taking their turn...");
      saveState();
      window.setTimeout(enemyTurn, 550);
    } else {
      state.selectedHeroId = nextHero?.id || heroesAlive()[0]?.id || actor.id;
      message(`${actor.name} acted. Choose another operative and action.`);
      render();
    }
  }

  function enemyTurn() {
    if (state.status !== "active") return;
    for (const enemy of enemiesAlive()) {
      const targets = heroesAlive();
      if (!targets.length) break;
      const target = targets[Math.floor(Math.random() * targets.length)];
      const guardKey = `${target.id}:guard`;
      let damage = Math.max(4, enemy.moves[0].power + enemy.attack * 0.3 - target.defense);
      if (state.effects[guardKey]) {
        damage = Math.max(1, Math.round(damage * 0.45));
        delete state.effects[guardKey];
      }
      target.hp = Math.max(0, target.hp - Math.round(damage));
      addLog(`${enemy.name} attacked ${target.name} for ${Math.round(damage)} damage${target.hp === 0 ? " — operative down!" : "."}`);
      if (checkBattleEnd()) break;
    }

    if (state.status === "active") {
      state.turn += 1;
      state.phase = "heroes";
      state._acted = [];
      if (!alive(findUnit(state.selectedHeroId))) state.selectedHeroId = heroesAlive()[0]?.id || state.heroes[0].id;
      message("Your turn. Select an operative and choose an action.");
    } else {
      message(state.status === "victory" ? "Victory! HYDRA has been driven from the outpost." : "Defeat. Your team has been incapacitated.");
    }
    render();
  }

  function checkBattleEnd() {
    if (enemiesAlive().length === 0) {
      state.status = "victory";
      state.phase = "ended";
      state._acted = [];
      return true;
    }
    if (heroesAlive().length === 0) {
      state.status = "defeat";
      state.phase = "ended";
      state._acted = [];
      return true;
    }
    return false;
  }

  $("save-button").addEventListener("click", () => saveState(true));
  $("restart-button").addEventListener("click", () => {
    if (!confirm("Restart this battle from the beginning? Your current battle save will be replaced.")) return;
    state = originalState();
    saveState();
    render();
    message("Fresh battle started. Select a hero to begin.");
  });

  // The game advances a hero action each time a move is executed. Each living hero acts once per round.
  // Normalize save data in case a browser reloads while an enemy turn was queued.
  if (state.phase === "enemies" && state.status === "active") {
    state.phase = "heroes";
    state._acted = [];
    state.targeting = false;
    state.selectedMoveId = null;
  }
  if (!state.heroes.some(alive) || !state.enemies.some(alive)) checkBattleEnd();
  render();
  if (state.status === "active" && !localStorage.getItem(SAVE_KEY)) message("Select a hero to begin your turn.");
})();