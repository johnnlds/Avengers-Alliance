"use strict";

/* =========================================
   MARVEL ALLIANCE - BATTLE PROTOTYPE
   ========================================= */

const $ = (id) => document.getElementById(id);

const MOVE_DATA = [
  {id:"shield-training",name:"S.H.I.E.L.D Training",attackType:"unarmed-melee",description:"Two-hit S.H.I.E.L.D. combat strike.",cost:8,damage:25.5,hits:2,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"phil"},
  {id:"smith-wesson",name:"Smith & Wesson",attackType:"ranged-gun",description:"A precise shot with Phil's sidearm.",cost:15,damage:30,hits:1,accuracy:87,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"phil"},
  {id:"destroyer-prototype",name:"Destroyer Prototype",attackType:"ranged-gun",description:"Fire the Destroyer Prototype at one enemy.",cost:22,damage:34.5,hits:1,accuracy:75,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"phil"},
  {id:"pep-talk",name:"Pep Talk",attackType:"buff",description:"Strengthen all allies.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:0,type:"buff",target:"all-allies",owner:"phil",buffs:["strengthened"],duration:3},
  {id:"double-punch",name:"Double Punch",attackType:"unarmed-melee",description:"Two punches against one enemy.",cost:8,damage:15.3,hits:2,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"bruiser"},
  {id:"shoulder-slam",name:"Shoulder Slam",attackType:"unarmed-melee",description:"A heavy shoulder slam.",cost:15,damage:18,hits:2,accuracy:87,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"bruiser"},
  {id:"spin-throw",name:"Spin Throw",attackType:"spin-melee",description:"Spin through all enemies.",cost:22,damage:20.7,hits:2,accuracy:75,crit:0,cooldown:0,type:"attack",target:"all-enemies",owner:"bruiser"},
  {id:"shield-protect",name:"S.H.I.E.L.D",attackType:"buff",description:"Shield one ally or yourself from the next attack.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:0,type:"protect",target:"ally",owner:"bruiser"},
  {id:"combo",name:"Martial Arts Combo",attackType:"unarmed-melee",description:"A two-hit martial arts combo.",cost:8,damage:19.55,hits:2,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"blackwidow"},
  {id:"bite",name:"Widow's Bite",attackType:"ranged-gun",description:"A two-hit electric attack.",cost:15,damage:23,hits:2,accuracy:87,crit:25,cooldown:0,type:"attack",target:"enemy",owner:"blackwidow"},
  {id:"kick",name:"Flying Kick",attackType:"flying-melee",description:"A powerful two-hit flying kick.",cost:22,damage:26.45,hits:2,accuracy:75,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"blackwidow"},
  {id:"widowmaker",name:"Widowmaker",attackType:"ranged-gun",description:"85% chance to weaken the target and 75% chance to stun with your next attack.",cost:10,damage:0,hits:0,accuracy:100,crit:0,cooldown:0,type:"debuff",target:"enemy",owner:"blackwidow",stunChance:75,applyDebuff:"weakened",debuffChance:85},
  {id:"cat-scratch",name:"Cat Scratch",attackType:"unarmed-melee",description:"Two quick slashes with a 50% chance to inflict Bleed.",cost:10,damage:14,hits:2,accuracy:95,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"blackcat",applyDebuff:"bleed",debuffChance:50},
  {id:"unlucky-strike",name:"Unlucky Strike",attackType:"unarmed-melee",description:"A strike that leaves the target debuffed.",cost:15,damage:20,hits:1,accuracy:87,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"blackcat"},
  {id:"theft",name:"Theft",attackType:"unarmed-melee",description:"Steal the target's buffs.",cost:15,damage:20,hits:1,accuracy:87,crit:10,cooldown:0,type:"attack",target:"enemy",owner:"blackcat",removeBuffs:true},
  {id:"stroke-of-luck",name:"Stroke of Luck",attackType:"buff",description:"Gain Lucky and an immediate free action. Cooldown: 2 turns.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:2,type:"buff",target:"self",owner:"blackcat",buffs:["lucky"],freeAction:true},
  {id:"sai-slash",name:"Sai Slash",attackType:"unarmed-melee",description:"A light sai slash with a 50% chance to inflict Bleed.",cost:10,damage:18.9,hits:1,accuracy:95,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"elektra",applyDebuff:"bleed",debuffChance:50},
  {id:"blood-bath",name:"Blood Bath",attackType:"spin-melee",description:"Attack all enemies with an 80% chance to inflict Bleed.",cost:18,damage:8.1,hits:1,accuracy:95,crit:0,cooldown:0,type:"attack",target:"all-enemies",owner:"elektra",applyDebuff:"bleed",debuffChance:80},
  {id:"assassin-strike",name:"Assassin Strike",attackType:"unarmed-melee",description:"A heavy strike with a 40% chance to be a Super Crit.",cost:22,damage:31.05,hits:1,accuracy:75,crit:0,cooldown:1,type:"attack",target:"enemy",owner:"elektra",superCritChance:40},
  {id:"smoke-bomb",name:"Smoke Bomb",attackType:"ranged-gun",description:"Gain Stealth for two rounds.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:0,type:"buff",target:"self",owner:"elektra",buffs:["stealth"],duration:2},
  {id:"sure-strike",name:"Sure Strike",attackType:"ranged-bow",description:"A precise bow shot.",cost:8,damage:25.5,hits:1,accuracy:100,crit:20,cooldown:0,type:"attack",target:"enemy",owner:"hawkeye"},
  {id:"putty-arrow",name:"Putty Arrow",attackType:"ranged-arrow",description:"An arrow that Slows the target.",cost:15,damage:30,hits:1,accuracy:87,crit:10,cooldown:0,type:"attack",target:"enemy",owner:"hawkeye",applyDebuff:"slow",debuffChance:100},
  {id:"electric-arrow",name:"Electric Arrow",attackType:"ranged-arrow",description:"Three electric hits with a 40% chance to stun the target.",cost:22,damage:34.5,hits:3,accuracy:75,crit:10,cooldown:0,type:"attack",target:"enemy",owner:"hawkeye",stunChance:40},
  {id:"boomerang-arrow",name:"Boomerang Arrow",attackType:"ranged-arrow",description:"Two hits against all enemies, with a 40% chance to Weaken.",cost:25,damage:15,hits:2,accuracy:95,crit:8,cooldown:0,type:"attack",target:"all-enemies",owner:"hawkeye",applyDebuff:"weakened",debuffChance:40},
  {id:"pym-punch",name:"Pym Punch",attackType:"unarmed-melee",description:"A powerful punch.",cost:8,damage:28.05,hits:1,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"antman"},
  {id:"little-uppercut",name:"Little Uppercut",attackType:"unarmed-melee",description:"A precise uppercut.",cost:15,damage:33,hits:1,accuracy:87,crit:20,cooldown:0,type:"attack",target:"enemy",owner:"antman"},
  {id:"swarm",name:"Swarm",attackType:"ranged-arrow",description:"Send a swarm against all enemies.",cost:25,damage:16.5,hits:1,accuracy:95,crit:0,cooldown:0,type:"attack",target:"all-enemies",owner:"antman"},
  {id:"shrink",name:"Shrink",attackType:"buff",description:"Gain Stealth and Strengthened.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:0,type:"buff",target:"self",owner:"antman",buffs:["stealth","strengthened"],duration:3},
  {id:"bare-knuckles",name:"Bare Knuckles",attackType:"unarmed-melee",description:"A three-hit brawl with a 50% chance to inflict Fear.",cost:8,damage:26.35,hits:3,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"daredevil",applyDebuff:"fear",debuffChance:50},
  {id:"billy-club",name:"Billy Club",attackType:"unarmed-melee",description:"Two hits with the Billy Club.",cost:15,damage:31,hits:2,accuracy:87,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"daredevil"},
  {id:"hallway-fight",name:"Hallway Fight",attackType:"unarmed-melee",description:"Fight every enemy with two hits.",cost:25,damage:15.5,hits:2,accuracy:95,crit:0,cooldown:0,type:"attack",target:"all-enemies",owner:"daredevil"},
  {id:"radar-sense",name:"Radar Sense",attackType:"buff",description:"Increase all stats by 10% for three turns.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:2,type:"buff",target:"self",owner:"daredevil",allStatsBoost:0.1,duration:3},
  {id:"ash-tray",name:"Ash Tray",attackType:"unarmed-melee",description:"A light attack with a 60% chance to Burn.",cost:10,damage:30.1,hits:1,accuracy:95,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"howard",applyDebuff:"burn",debuffChance:60},
  {id:"quack-fu",name:"Quack Fu",attackType:"unarmed-melee",description:"Three-hit Quack Fu combo.",cost:15,damage:43,hits:3,accuracy:87,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"howard"},
  {id:"big-freaking-gun",name:"Big Freaking Gun",attackType:"ranged-gun",description:"Fire Howard's massive gun.",cost:22,damage:49.45,hits:1,accuracy:75,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"howard"},
  {id:"iron-duck",name:"Iron Duck",attackType:"buff",description:"Gain Strengthened and Armor for two turns. Starts on a three-turn cooldown.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:3,type:"buff",target:"self",owner:"howard",buffs:["strengthened","armor"],duration:2},
  {id:"assault-rifle",name:"Assault Rifle",attackType:"ranged-gun",description:"Three rifle hits.",cost:8,damage:36.55,hits:3,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"punisher"},
  {id:"frag-grenade",name:"Frag Grenade",attackType:"ranged-arrow",description:"A grenade that damages one target and causes the other enemies to Bleed.",cost:17,damage:38.7,hits:1,accuracy:87,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"punisher",bleedOthersOnly:true},
  {id:"battle-van",name:"Battle Van",attackType:"spin-melee",description:"Attack all enemies with a 50% chance to inflict Fear.",cost:25,damage:21.5,hits:1,accuracy:95,crit:0,cooldown:0,type:"attack",target:"all-enemies",owner:"punisher",applyDebuff:"fear",debuffChance:50},
  {id:"sniper-rifle",name:"Sniper Rifle",attackType:"ranged-gun",description:"A deadly shot with a 40% hit chance that eliminates its target from the next wave if it hits.",cost:15,damage:0,hits:1,accuracy:40,crit:0,cooldown:2,type:"attack",target:"enemy",owner:"punisher",eliminateNextWave:true},
  {id:"squirrel-strike",name:"Squirrel Strike",attackType:"unarmed-melee",description:"A precise strike.",cost:8,damage:34.85,hits:1,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"squirrelgirl"},
  {id:"tippy-toe",name:"Tippy Toe",attackType:"buff",description:"Gain Squirrelly for two turns.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:1,type:"buff",target:"self",owner:"squirrelgirl",buffs:["squirrelly"],duration:2},
  {id:"furry-fury",name:"Furry Fury",attackType:"unarmed-melee",description:"Attack all enemies.",cost:25,damage:20.5,hits:1,accuracy:95,crit:0,cooldown:0,type:"attack",target:"all-enemies",owner:"squirrelgirl"},
  {id:"get-em-monkey-joe",name:"Get 'Em, Monkey Joe",attackType:"buff",description:"Inflict Monkey Joe on one enemy.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:1,type:"apply-debuff",target:"enemy",owner:"squirrelgirl",applyDebuff:"monkeyJoe",debuffChance:100},
  {id:"mericas-fist",name:"'Merica's Fist",attackType:"unarmed-melee",description:"A powerful punch.",cost:8,damage:56.1,hits:1,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"captainamerica"},
  {id:"shield-bash",name:"Shield Bash",attackType:"unarmed-melee",description:"A shield bash with a 40% chance to stun.",cost:15,damage:66,hits:1,accuracy:87,crit:0,cooldown:0,type:"attack",target:"enemy",owner:"captainamerica",stunChance:40},
  {id:"not-a-frisbee",name:"Not a Frisbee",attackType:"ranged-arrow",description:"Throw the shield at all enemies.",cost:25,damage:33,hits:1,accuracy:95,crit:0,cooldown:0,type:"attack",target:"all-enemies",owner:"captainamerica"},
  {id:"vibranium-protection",name:"Vibranium Protection",attackType:"buff",description:"Gain Shielded and Attention for two turns.",cost:7,damage:0,hits:0,accuracy:100,crit:0,cooldown:2,type:"buff",target:"self",owner:"captainamerica",buffs:["shielded","attention"],duration:2},


  {id:"fist-of-khonshu",name:"Fist of Khonshu",attackType:"unarmed-melee",description:"A strike with a 40% chance to inflict Fear.",cost:8,damage:60.35,hits:1,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"moonknight",applyDebuff:"fear",debuffChance:40},
  {id:"crescent-darts",name:"Crescent Darts",attackType:"ranged-throwing",description:"Three ranged hits, each with a 40% chance to inflict Bleed.",cost:15,damage:71,hits:3,accuracy:87,crit:10,cooldown:0,type:"attack",target:"enemy",owner:"moonknight",applyDebuff:"bleed",debuffChance:40},
  {id:"blood-moon",name:"Blood Moon",attackType:"unarmed-melee",description:"Strike all enemies and inflict Bleed, with a 50% chance to cause Bleed Out.",cost:22,damage:81.65,hits:1,accuracy:75,crit:15,cooldown:0,type:"attack",target:"all-enemies",owner:"moonknight",applyDebuff:"bleed",debuffChance:100,secondaryDebuff:"bleedOut",secondaryDebuffChance:50},
  {id:"no-dodging",name:"No Dodging",attackType:"buff",description:"Gain Can't Miss. While damaged, Moon Knight gains Strengthened and Protection.",cost:7,damage:0,hits:1,accuracy:100,crit:0,cooldown:1,type:"buff",target:"self",owner:"moonknight",buffs:["cantMiss"],duration:3},
  {id:"light-daggers",name:"Light Daggers",attackType:"ranged-energy",description:"Three energy hits with a 60% chance to Blind.",cost:8,damage:53.55,hits:3,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"cloakdagger",applyDebuff:"blind",debuffChance:60},
  {id:"lightforce",name:"Lightforce",attackType:"buff",description:"Heal all allies for 15%.",cost:20,damage:0,hits:1,accuracy:100,crit:0,cooldown:2,type:"buff",target:"all-allies",owner:"cloakdagger",buffs:["smallheal"]},
  {id:"darkforce",name:"Darkforce",attackType:"ranged-energy",description:"A dark energy attack with a 50% chance to inflict Fear.",cost:15,damage:63,hits:1,accuracy:87,crit:10,cooldown:0,type:"attack",target:"enemy",owner:"cloakdagger",applyDebuff:"fear",debuffChance:50},
  {id:"darkforce-dimension",name:"Darkforce Dimension",attackType:"debuff",description:"Trap one enemy in the Darkforce Dimension.",cost:7,damage:0,hits:1,accuracy:100,crit:0,cooldown:2,type:"apply-debuff",target:"enemy",owner:"cloakdagger",applyDebuff:"darkforceDimension",debuffChance:100,duration:4},
  {id:"thwip-thwip",name:"Thwip Thwip",attackType:"ranged-web",description:"Two web attacks with a 50% chance to Slow.",cost:8,damage:103.7,hits:2,accuracy:95,crit:8,cooldown:0,type:"attack",target:"enemy",owner:"spiderman",applyDebuff:"slow",debuffChance:50},
  {id:"web-swing",name:"Web Swing",attackType:"flying-melee",description:"A swinging kick with a 30% chance to Stun.",cost:15,damage:122,hits:1,accuracy:87,crit:10,cooldown:0,type:"attack",target:"enemy",owner:"spiderman",stunChance:30},
  {id:"spidey-sense",name:"Spidey Sense",attackType:"buff",description:"Gain a Free Action, Spider Sense, and Strengthened.",cost:7,damage:0,hits:1,accuracy:100,crit:0,cooldown:2,type:"buff",target:"self",owner:"spiderman",buffs:["freeaction","spiderSense","strengthened"],duration:2},
  {id:"no-holding-back",name:"No Holding Back",attackType:"unarmed-melee",description:"A heavy attack with a 60% chance to Stun.",cost:22,damage:140.3,hits:1,accuracy:80,crit:25,cooldown:0,type:"attack",target:"enemy",owner:"spiderman",stunChance:60},
  {id:"sword-dance",name:"Sword Dance",attackType:"unarmed-melee",description:"A sword strike with a 30% chance to inflict Bleed.",cost:8,damage:113.05,hits:1,accuracy:95,crit:8,cooldown:2,type:"attack",target:"enemy",owner:"deadpool",applyDebuff:"bleed",debuffChance:30},
  {id:"pew-pew-pew",name:"Pew Pew Pew",attackType:"ranged-gun",description:"Twenty rapid gunshots.",cost:15,damage:133,hits:20,accuracy:87,crit:34,cooldown:0,type:"attack",target:"enemy",owner:"deadpool"},
  {id:"mystery-box",name:"Mystery Box",attackType:"buff",description:"Randomly apply three buffs to your team and three debuffs to the enemy team.",cost:20,damage:0,hits:1,accuracy:100,crit:0,cooldown:2,type:"random-effects",target:"all",owner:"deadpool"},
  {id:"maximum-effort",name:"Maximum Effort",attackType:"unarmed-melee",description:"A super-heavy strike that inflicts Temporary Damage on Deadpool.",cost:40,damage:186.2,hits:1,accuracy:93,crit:22,cooldown:2,type:"attack",target:"enemy",owner:"deadpool",selfDebuff:"temporaryDamage"},
  {id:"rock-fists",name:"Rock Fists",attackType:"unarmed-melee",description:"Two heavy punches with a 30% chance to Stun.",cost:15,damage:86,hits:2,accuracy:93,crit:10,cooldown:0,type:"attack",target:"enemy",owner:"thing",stunChance:30},
  {id:"fault-line",name:"Fault Line",attackType:"unarmed-melee",description:"Strike all enemies.",cost:25,damage:60,hits:1,accuracy:95,crit:15,cooldown:0,type:"attack",target:"all-enemies",owner:"thing"},
  {id:"clobberin-time",name:"Clobberin Time",attackType:"unarmed-melee",description:"Three powerful hits with a 30% chance to Stun and 50% chance to Weaken.",cost:22,damage:98.9,hits:3,accuracy:75,crit:25,cooldown:0,type:"attack",target:"enemy",owner:"thing",stunChance:30,applyDebuff:"weakened",debuffChance:50},
  {id:"rock-wall",name:"Rock Wall",attackType:"buff",description:"Gain Attention and Armor.",cost:7,damage:0,hits:1,accuracy:100,crit:0,cooldown:3,type:"buff",target:"self",owner:"thing",buffs:["attention","armorDamageReduction"],duration:2},


  { id:"hydra-strike", name:"Hydra Strike", attackType:"unarmed-melee", description:"A basic Hydra melee attack.", cost:8, damage:18, hits:1, accuracy:82, crit:8, cooldown:0, type:"attack", target:"enemy", enemyUsable:true },

  { id:"stormbreaker", name:"Stormbreaker", attackType:"unarmed-melee", description:"Beta Ray Bill strikes one enemy with Stormbreaker.", cost:572.24, damage:1416.6, hits:1, accuracy:75, crit:2, cooldown:0, type:"attack", target:"enemy", owner:"beta-ray-bill" },
  { id:"thunderstruck", name:"Thunderstruck", attackType:"ranged-gun", description:"Unleash a ranged thunder attack against one enemy.", cost:1072.95, damage:1574, hits:1, accuracy:87, crit:8, cooldown:0, type:"attack", target:"enemy", owner:"beta-ray-bill" },
  { id:"flying-kick-bill", name:"I Say Thee Nay!", attackType:"flying-melee", description:"A powerful flying kick that hits all enemies.", cost:1573.66, damage:519.42, hits:1, accuracy:100, crit:32, cooldown:0, type:"attack", target:"all-enemies", owner:"beta-ray-bill" },
  { id:"lightning-strike", name:"Lightning Strike!", attackType:"ranged-gun", description:"Strike all enemies with lightning. Each enemy hit has a 100% chance to be stunned. Cooldown: 2 rounds.", cost:500.71, damage:157.4, hits:1, accuracy:60, crit:0, cooldown:2, type:"attack", target:"all-enemies", stunChance:100, owner:"beta-ray-bill" }
];

function formatCombatNumber(value) {
  return String(Math.ceil(value));
}

function getMove(moveId) {
  return MOVE_DATA.find(move => move.id === moveId);
}
function getMoveCost(unit, move) {
  const scalingHeroId = unit?.practiceHeroId || unit?.id;
  return move && unit && ["phil","bruiser","blackwidow","blackcat","elektra","hawkeye","antman","daredevil","howard","punisher","squirrelgirl","captainamerica","moonknight","cloakdagger","spiderman","deadpool","thing"].includes(scalingHeroId)
    ? Math.ceil(unit.maxSta * move.cost / 100)
    : (move?.cost || 0);
}
function getMovesForUnit(unit) {
  if (!unit) return [];
  if (unit.team === "enemy") return unit.practiceOpponent
    ? (unit.moveIds || []).map(getMove).filter(Boolean)
    : MOVE_DATA.filter(move => move.enemyUsable);
  return (unit.moveIds || []).map(getMove).filter(Boolean);
}

const HERO_TEMPLATES = [
  {
    id: "phil",
    name: "Phil Coulson",
    description: "S.H.I.E.L.D. field leader",
    image: "Phil",
    team: "hero",
    maxHp: 90,
    maxSta: 110,
    atk: 30,
    acc: 35,
    def: 19,
    eva: 72,
    moveIds: ["shield-training","smith-wesson","destroyer-prototype","pep-talk"]
  },
  {
    id: "bruiser",
    name: "S.H.I.E.L.D. Bruiser",
    description: "Heavy frontline fighter",
    image: "Bruiser",
    team: "hero",
    maxHp: 120,
    maxSta: 90,
    atk: 18,
    acc: 22,
    def: 39,
    eva: 66,
    moveIds: ["double-punch","shoulder-slam","spin-throw","shield-protect"]
  },
  {
    id: "blackwidow",
    name: "Black Widow",
    description: "Elite covert operative",
    image: "Black Widow",
    team: "hero",
    maxHp: 100,
    maxSta: 110,
    atk: 23,
    acc: 20,
    def: 24,
    eva: 82,
    moveIds: ["combo","bite","kick","widowmaker"]
  },
  {
    id: "beta-ray-bill",
    name: "Beta Ray Bill",
    description: "Korbinite champion wielding Stormbreaker",
    image: "Bill",
    team: "hero",
    maxHp: 7868,
    maxSta: 7153,
    atk: 1574,
    acc: 1288,
    def: 1574,
    eva: 1144,
    moveIds: ["stormbreaker","thunderstruck","flying-kick-bill","lightning-strike"]
  }
,
  {
    id: "blackcat", name: "Black Cat", description: "Master thief",
    image: "Black Cat", team: "hero", maxHp: 100, maxSta: 100,
    atk: 20, acc: 20, def: 21, eva: 91,
    moveIds: ["cat-scratch","unlucky-strike","theft","stroke-of-luck"]
  },
  {
    id: "elektra", name: "Elektra", description: "Assassin",
    image: "Elektra", team: "hero", maxHp: 110, maxSta: 100,
    atk: 27, acc: 23, def: 26, eva: 80,
    moveIds: ["sai-slash","blood-bath","assassin-strike","smoke-bomb"]
  },
  {
    id: "hawkeye", name: "Hawkeye", description: "Expert archer",
    image: "Hawkeye", team: "hero", maxHp: 90, maxSta: 110,
    atk: 30, acc: 35, def: 19, eva: 72, characterAbilities:["marksman"],
    moveIds: ["sure-strike","putty-arrow","electric-arrow","boomerang-arrow"]
  },
  {
    id: "antman", name: "Ant-Man", description: "Pym particle hero",
    image: "Ant-Man", team: "hero", maxHp: 148, maxSta: 148,
    atk: 33, acc: 34, def: 37, eva: 82,
    moveIds: ["pym-punch","little-uppercut","swarm","shrink"]
  },
  {
    id: "daredevil", name: "Daredevil", description: "The Man Without Fear",
    image: "Daredevil", team: "hero", maxHp: 158, maxSta: 158,
    atk: 31, acc: 36, def: 42, eva: 87,
    moveIds: ["bare-knuckles","billy-club","hallway-fight","radar-sense"]
  },
  {
    id: "howard", name: "Howard the Duck", description: "Duck detective",
    image: "Howard the Duck", team: "hero", maxHp: 133, maxSta: 138,
    atk: 43, acc: 39, def: 32, eva: 77,
    moveIds: ["ash-tray","quack-fu","big-freaking-gun","iron-duck"]
  },
  {
    id: "punisher", name: "Punisher", description: "Vigilante",
    image: "Punisher", team: "hero", maxHp: 158, maxSta: 148,
    atk: 43, acc: 39, def: 37, eva: 85, characterAbilities:["marksman"],
    moveIds: ["assault-rifle","frag-grenade","battle-van","sniper-rifle"]
  },
  {
    id: "squirrelgirl", name: "Squirrel Girl", description: "Unbeatable squirrel girl",
    image: "Squirrel Girl", team: "hero", maxHp: 153, maxSta: 158,
    atk: 41, acc: 42, def: 41, eva: 88,
    moveIds: ["squirrel-strike","tippy-toe","furry-fury","get-em-monkey-joe"]
  },
  {
    id: "captainamerica", name: "Captain America", description: "Super-soldier and shield wielder",
    image: "Captain America", team: "hero", maxHp: 354, maxSta: 302,
    atk: 66, acc: 66, def: 97, eva: 125,
    moveIds: ["mericas-fist","shield-bash","not-a-frisbee","vibranium-protection"]
  },
  {
    id:"moonknight",name:"Moon Knight",description:"Fist of Khonshu",image:"Moon Knight",team:"hero",
    maxHp:329,maxSta:302,atk:71,acc:68,def:72,eva:90,
    moveIds:["fist-of-khonshu","crescent-darts","blood-moon","no-dodging"]
  },
  {
    id:"cloakdagger",name:"Cloak & Dagger",description:"Lightforce and Darkforce duo",image:"Cloak & Dagger",team:"hero",
    maxHp:274,maxSta:312,atk:63,acc:86,def:87,eva:200,characterAbilities:["lightforce-cleanse"],
    moveIds:["light-daggers","lightforce","darkforce","darkforce-dimension"]
  },
  {
    id:"spiderman",name:"Spider-Man",description:"Friendly neighborhood Spider-Man",image:"Spider-Man",team:"hero",
    maxHp:417,maxSta:421,atk:122,acc:130,def:115,eva:144,
    moveIds:["thwip-thwip","web-swing","spidey-sense","no-holding-back"]
  },
  {
    id:"deadpool",name:"Deadpool",description:"Merc with a Mouth",image:"Deadpool",team:"hero",
    maxHp:457,maxSta:455,atk:133,acc:106,def:100,eva:125,characterAbilities:["regeneration"],
    moveIds:["sword-dance","pew-pew-pew","mystery-box","maximum-effort"]
  },
  {
    id:"thing",name:"Thing",description:"The Thing",image:"Thing",team:"hero",
    maxHp:527,maxSta:435,atk:86,acc:105,def:173,eva:92,characterAbilities:["bulletproof-skin"],
    moveIds:["rock-fists","fault-line","clobberin-time","rock-wall"]
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
let practiceMode = null;
let round = 1;
const TOTAL_WAVES = 10;
let wave = 1;
let waveAnnouncementTimer = null;
let initiative = [];
let turnIndex = 0;
let currentActor = null;
let inspectedUnitId = null;
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
let destroyerPrototypePrimed = false;

function createUnit(template) {
  return {
    ...template,
    hp: template.maxHp,
    sta: template.maxSta,
    baseAtk: template.atk,
    baseAcc: template.acc,
    alive: true,
    cooldowns: template.id === "howard" ? { "iron-duck": 3 } : {},
    attackDebuffTurns: 0,
    stunPrimed: false,
    stunned: false,
    damageBoost: 0,
    protectedUntilAttack: false,
    effects: {
      strengthened: 0, superCrit: false, lucky: false, stealth: 0, armor: 0, armorDamageReduction: 0,
      squirrelly: 0, attention: 0,
      weakened: false, bleed: 0, confused: 0, burn: 0, slow: 0, fear: 0,
      monkeyJoe: 0, bleedOut: 0, blind: 0, cantMiss: 0, temporaryDamage: 0, darkforceDimension: 0, spiderSense: 0
    },
    characterAbilities: [...(template.characterAbilities || [])], revivedThisWave: false, temporaryDamageHealTurns: 0,
    baseDef: template.def,
    baseEva: template.eva,
    freeActions: 0
  };
}

function createWaveEnemies() {
  const multiplier = 1 + (wave - 1) * 0.01;
  const waveTemplates = ENEMY_TEMPLATES.map(template => {
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
  const eliminations = heroes.reduce((count, hero) => count + (hero.pendingWaveEliminations || 0), 0);
  for (let i = 0; i < eliminations && waveTemplates.length; i++) {
    waveTemplates.splice(Math.floor(Math.random() * waveTemplates.length), 1);
  }
  heroes.forEach(hero => { hero.pendingWaveEliminations = 0; });
  return waveTemplates;
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

  // Clear the defeated wave from the battlefield during the announcement.
  enemies = [];
  log(`Wave cleared! Your team recovers 30% of maximum HP and stamina. Wave ${wave} of ${TOTAL_WAVES} begins.`, "good");
  renderAll();

  if (waveAnnouncementTimer !== null) clearTimeout(waveAnnouncementTimer);
  const announcement = $("waveAnnouncement");
  if (announcement) {
    announcement.textContent = `Wave ${wave}`;
    announcement.classList.remove("hidden", "wave-announcement-show");
    // Use the Web Animations API so the announcement is visible even when
    // the device requests reduced motion and CSS animations are suppressed.
    if (typeof announcement.animate === "function") {
      announcement.animate([
        { opacity: 0, transform: "translate(-50%, -50%) scale(.72)" },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1.08)", offset: 0.16 },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1)", offset: 0.28 },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1)", offset: 0.82 },
        { opacity: 0, transform: "translate(-50%, -50%) scale(.94)" }
      ], { duration: 1500, easing: "ease-out", fill: "both" });
    } else {
      announcement.classList.add("wave-announcement-show");
    }
  }
  waveAnnouncementTimer = setTimeout(() => {
    if (announcement) {
      announcement.classList.add("hidden");
      announcement.classList.remove("wave-announcement-show");
    }
    waveAnnouncementTimer = null;
    if (battleOver) return;

    // Bring the next wave in from beyond the right edge after the title.
    enemies = createWaveEnemies();
    renderAll();
    const enemyTeam = $("enemyTeam");
    if (enemyTeam) {
      const enemyCards = [...enemyTeam.querySelectorAll(".unit")];
      // Animate each enemy from beyond the right edge, independently of CSS
      // reduced-motion settings and other transforms used by combat effects.
      enemyCards.forEach((card, index) => {
        if (typeof card.animate === "function") {
          card.animate([
            { opacity: 0, transform: `translateX(${Math.max(window.innerWidth, document.documentElement.clientWidth) + 140}px)` },
            { opacity: 1, transform: "translateX(0)" }
          ], {
            duration: 850,
            delay: index * 100,
            easing: "cubic-bezier(.18,.72,.22,1)",
            fill: "both"
          });
        } else {
          enemyTeam.classList.remove("wave-enemies-enter");
          void enemyTeam.offsetWidth;
          enemyTeam.classList.add("wave-enemies-enter");
        }
      });
    }
    window.setTimeout(() => {
      if (!battleOver && wave > 1) startRound();
    }, 950);
  }, 1500);
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
  practiceMode = new URLSearchParams(window.location.search).get("practice");
  if (!["2-star", "3-star", "4-star", "4-star-hard"].includes(practiceMode)) practiceMode = null;
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
  if (practiceMode) {
    const opponentIds = practiceMode === "4-star-hard"
      ? ["spiderman", "thing", "deadpool"]
      : [practiceMode === "2-star" ? "daredevil" : practiceMode === "3-star" ? "captainamerica" : "spiderman"];
    enemies = opponentIds.map(opponentId => {
      const template = HERO_TEMPLATES.find(hero => hero.id === opponentId);
      const opponent = { ...template, id: `practice-${opponentId}`, team: "enemy", practiceOpponent: true, practiceHeroId: opponentId };
      return createUnit(opponent);
    });
  } else {
    enemies = createWaveEnemies();
  }

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
  destroyerPrototypePrimed = false;
  battleOver = false;
  waitingForEnemy = false;

  $("resultOverlay").classList.add("hidden");
  $("battleLog").innerHTML = "";

  if (practiceMode) {
    log(`Practice battle started: your team versus ${enemies.map(enemy => enemy.name).join(", ")}.`, "good");
    log(enemies.length > 1 ? "Defeat the entire enemy team to complete the fight." : "Defeat your practice opponent to complete the fight.", "good");
    log("Choose an ability first, then select your opponent.");
  } else {
    log("Battle started! S.H.I.E.L.D. versus Hydra.", "good");
    log(`Wave ${wave} of ${TOTAL_WAVES}: Hydra forces are advancing.`, "good");
    log("Choose an ability first, then select a Hydra target.");
  }

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
   STATUS EFFECTS
   ========================================= */

function applyEffect(unit, name, duration = 1) {
  if (!unit || !unit.alive || !unit.effects) return;
  const effect = name.replace(/[^a-z]/gi, "").toLowerCase();
  const durationEffects = {
    strengthened: "strengthened", stealth: "stealth", armor: "armor", damagearmor: "armorDamageReduction",
    attention: "attention", bleed: "bleed", confused: "confused",
    burn: "burn", slow: "slow", fear: "fear", monkeyjoe: "monkeyJoe", bleedout: "bleedOut", blind: "blind", cantmiss: "cantMiss", temporarydamage: "temporaryDamage", darkforcedimension: "darkforceDimension", spidersense: "spiderSense"
  };
  if (durationEffects[effect]) {
    const key = durationEffects[effect];
    unit.effects[key] = duration;
  } else if (effect === "supercrit") unit.effects.superCrit = true;
  else if (effect === "lucky") unit.effects.lucky = true;
  else if (effect === "spiderSense") unit.effects.spiderSense = duration;
  else if (effect === "cantMiss") unit.effects.cantMiss = duration;
  else if (effect === "temporaryDamage") unit.effects.temporaryDamage = 1;
  else if (effect === "darkforceDimension") unit.effects.darkforceDimension = duration;
  else if (effect === "weakened") unit.effects.weakened = true;
  else if (effect === "debuffed") removeAllBuffs(unit);
  else if (effect === "squirrelly") unit.effects.squirrelly = 2;
  else if (effect === "freeaction") unit.freeActions = (unit.freeActions || 0) + 1;
  else if (effect === "shielded") unit.protectedUntilAttack = true;
  else if (effect === "smallheal") healUnit(unit, 0.15);
  else if (effect === "mediumheal") healUnit(unit, 0.35);
  else if (effect === "largeheal") healUnit(unit, 0.6);
  else if (effect === "fullheal") healUnit(unit, 1);
  syncEffectStats(unit);
  renderAll();
}

function healUnit(unit, fraction) {
  if (!unit || !unit.alive) return;
  const before = unit.hp;
  unit.hp = Math.min(unit.maxHp, unit.hp + unit.maxHp * fraction);
  log(`${unit.name} recovers ${Math.ceil(unit.hp - before)} HP.`, "good");
}

function syncEffectStats(unit) {
  if (!unit || !unit.effects) return;
  unit.atk = unit.baseAtk * (unit.attackDebuffTurns > 0 ? 0.5 : 1) *
    (unit.effects.allStatsBoost ? 1 + unit.effects.allStatsBoost : 1) * (unit.effects.strengthened > 0 ? 1.25 : 1);
  unit.def = unit.baseDef * (unit.effects.allStatsBoost ? 1 + unit.effects.allStatsBoost : 1) * (unit.effects.armor > 0 ? 1.25 : 1);
  unit.eva = unit.baseEva * (unit.effects.allStatsBoost ? 1 + unit.effects.allStatsBoost : 1) * (unit.effects.slow > 0 ? 0.8 : 1);
  unit.acc = unit.baseAcc * (unit.effects.allStatsBoost ? 1 + unit.effects.allStatsBoost : 1);
}

function removeAllBuffs(unit) {
  if (!unit || !unit.effects) return;
  unit.effects.strengthened = 0;
  unit.effects.superCrit = false;
  unit.effects.lucky = false;
  unit.effects.stealth = 0;
  unit.effects.armor = 0;
  unit.effects.armorDamageReduction = 0;
  unit.effects.squirrelly = 0;
  unit.effects.attention = 0;
  unit.damageBoost = 0;
  unit.protectedUntilAttack = false;
  syncEffectStats(unit);
}

function expireTurnEffects(unit) {
  if (!unit || !unit.effects) return;
  for (const key of ["strengthened", "stealth", "armor", "armorDamageReduction", "attention", "bleed", "confused", "burn", "slow", "fear", "monkeyJoe", "bleedOut", "blind", "cantMiss", "temporaryDamage", "darkforceDimension", "spiderSense"]) {
    if (unit.effects[key] > 0) unit.effects[key]--;
  }
  if (unit.effects.allStatsTurns > 0) {
    unit.effects.allStatsTurns--;
    if (unit.effects.allStatsTurns === 0) unit.effects.allStatsBoost = 0;
  }
  // Squirrelly is a two-turn buff, then disappears.
  if (unit.effects.squirrelly > 0) unit.effects.squirrelly--;
  syncEffectStats(unit);
}

function applyEndOfTurnDamage(unit) {
  if (!unit || !unit.alive || !unit.effects) return;
  const effects = unit.effects;
  const damage = ((effects.bleed > 0 ? unit.maxHp * 0.04 * (effects.bleedOut > 0 ? 2 : 1) : 0) +
    (effects.burn > 0 ? unit.maxHp * 0.04 : 0) + (effects.monkeyJoe > 0 ? unit.maxHp * 0.05 : 0) +
    (effects.darkforceDimension > 0 ? unit.maxHp * 0.06 : 0) + (effects.temporaryDamage > 0 ? unit.maxHp * 0.30 : 0)) * (effects.armorDamageReduction > 0 ? 0.8 : 1);
  if (damage <= 0) return;
  unit.hp = Math.max(0, unit.hp - damage);
  log(`${unit.name} takes ${Math.ceil(damage)} damage from ongoing effects.`, "damage");
  if (effects.temporaryDamage > 0) { effects.temporaryDamage = 0; unit.temporaryDamageHealTurns = 3; }
  if (unit.temporaryDamageHealTurns > 0 && unit.alive) { const before = unit.hp; unit.hp = Math.min(unit.maxHp, unit.hp + unit.maxHp * 0.10); if (unit.hp > before) log(`${unit.name} recovers ${Math.ceil(unit.hp-before)} HP.`, "good"); unit.temporaryDamageHealTurns--; }
  if (unit.hp <= 0) { unit.alive = false; log(`${unit.name} has been defeated!`, "good"); }
}

function onUnitDamaged(unit) {
  if (!unit?.alive || unit.id !== "moonknight") return;
  applyEffect(unit, "strengthened", 3);
  applyEffect(unit, "armor", 3);
  log("Moon Knight gains Strengthened and Protection after taking damage!", "good");
}

function resolveDefeat(unit) {
  const team = unit.team === "hero" ? heroes : enemies;
  if (unit.characterAbilities?.includes("regeneration") && team.some(other => other !== unit && other.alive)) { unit.hp = Math.max(1, unit.maxHp * 0.05); log(`${unit.name} regenerates with 5% health!`, "good"); return; }
  if (unit.characterAbilities?.includes("revival") && !unit.revivedThisWave && Math.random() < 0.30) { unit.revivedThisWave = true; unit.hp = Math.max(1, unit.maxHp * 0.30); log(`${unit.name} revives with 30% health!`, "good"); return; }
  unit.alive = false; unit.hp = 0; log(`${unit.name} has been defeated!`, "good");
}

function redirectSingleTarget(attacker, target, move) {
  if (!target || !attacker || move.target !== "enemy" && move.target !== "ally") return target;
  const targetTeam = target.team === "hero" ? heroes : enemies;
  if (target.effects?.attention > 0) return target;
  const protectedUnit = targetTeam.find(unit => unit.alive && unit.effects?.attention > 0);
  return protectedUnit || target;
}

/* =========================================
   RENDERING
   ========================================= */


function renderBuffsDebuffs() {
  const root = $("buffsDebuffsList");
  if (!root) return;
  root.innerHTML = "";

  const activeUnits = [...heroes, ...enemies].filter(unit => unit.alive);
  let count = 0;
  for (const unit of activeUnits) {
    const effects = [];
    if (unit.damageBoost > 0) effects.push({
      type: "buff",
      name: "Pep Talk",
      description: `Damage increased by ${Math.ceil(unit.damageBoost * 100)}% for their next attack.`
    });
    if (unit.protectedUntilAttack) effects.push({
      type: "buff",
      name: "S.H.I.E.L.D",
      description: "Blocks the next incoming attack completely, then protection wears off."
    });
    if (unit.stunPrimed) effects.push({
      type: "buff",
      name: "Stun ready",
      description: "Their next attack has a 75% chance to stun the target and make them lose their next action."
    });
    if (unit.attackDebuffTurns > 0) effects.push({
      type: "debuff",
      name: "Attack reduced",
      description: "Attack is reduced by 50% until this character takes their next action."
    });
    if (unit.stunned) effects.push({
      type: "debuff",
      name: "Stunned",
      description: "This character loses their next action."
    });
    for (const [key, label, type, description] of [
      ["strengthened", "Strengthened", "buff", "Attack increased by 25%."],
      ["superCrit", "Super Crit", "buff", "Next attack deals double damage; a dodge consumes it."],
      ["lucky", "Lucky", "buff", "Next successful attack is guaranteed to critically hit."],
      ["stealth", "Stealth", "buff", "40% chance to dodge incoming attacks."],
      ["armor", "Protection", "buff", "Defense increased by 25%."],
      ["armorDamageReduction", "Armor", "buff", "Damage taken is reduced by 20%."],
      ["squirrelly", "Squirrelly", "buff", "Next attack gains an extra hit for 50% of total attack damage."],
      ["attention", "Attention", "buff", "Allies cannot be targeted while this is active."],
      ["weakened", "Weakened", "debuff", "Next attack deals 50% less damage."],
      ["bleed", "Bleed", "debuff", "Takes 4% of max HP damage at end of turn."],
      ["confused", "Confused", "debuff", "40% chance offensive abilities target a living teammate."],
      ["burn", "Burn", "debuff", "Takes 4% of max HP damage at end of turn."],
      ["slow", "Slow", "debuff", "Evasion reduced by 20%."],
      ["fear", "Fear", "debuff", "Attack damage and hit chance are reduced by 20%."],
      ["monkeyJoe", "Monkey Joe", "debuff", "Takes 5% of max HP damage at end of turn."],
      ["bleedOut", "Bleed Out", "debuff", "Bleed damage is doubled."], ["blind", "Blind", "debuff", "Attacks are 40% more likely to miss."],
      ["cantMiss", "Can't Miss", "buff", "Attacks are guaranteed to hit."], ["temporaryDamage", "Temporary Damage", "debuff", "Takes 30% damage, then heals 10% max HP over 3 turns."],
      ["darkforceDimension", "Darkforce Dimension", "debuff", "Loses 6% max HP instead of taking a normal turn."], ["spiderSense", "Spider Sense", "buff", "80% chance to dodge attacks."]
    ]) {
      const value = unit.effects?.[key];
      if (value === true || (typeof value === "number" && value > 0)) {
        effects.push({ type, name: label, description: typeof value === "number" ? `${description} (${value} turn(s) left.)` : description });
      }
    }
    if (!effects.length) continue;

    const character = document.createElement("div");
    character.className = "buffs-debuffs-character";
    const name = document.createElement("strong");
    name.className = "buffs-debuffs-name";
    name.textContent = unit.name + (unit.team === "enemy" ? " (Enemy)" : "");
    character.appendChild(name);

    for (const effect of effects) {
      const item = document.createElement("div");
      item.className = `buffs-debuffs-effect ${effect.type}`;
      const title = document.createElement("strong");
      title.textContent = `${effect.type === "buff" ? "+" : "−"} ${effect.name}`;
      const description = document.createElement("span");
      description.textContent = effect.description;
      item.append(title, description);
      character.appendChild(item);
    }
    root.appendChild(character);
    count++;
  }

  if (!count) {
    const empty = document.createElement("p");
    empty.className = "buffs-debuffs-empty";
    empty.textContent = "No active buffs or debuffs.";
    root.appendChild(empty);
  }
}

function renderAll() {
  renderBuffsDebuffs();
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

      // Yellow preview shows expected HP loss for the currently selected attack.
      const previewMove = pendingMoveId ? getMove(pendingMoveId) : null;
      const previewsHpLoss = unit.team === "enemy" && unit.alive && previewMove &&
        previewMove.type === "attack" && ["enemy", "all-enemies"].includes(previewMove.target) &&
        previewMove.damage > 0;
      if (previewsHpLoss) {
        const hpPreview = document.createElement("span");
        hpPreview.className = "roster-hp-preview";
        const currentPercent = Math.max(0, Math.min(100, unit.hp / unit.maxHp * 100));
        const previewDamage = Math.min(unit.hp, previewMove.damage);
        const previewPercent = previewDamage / unit.maxHp * 100;
        hpPreview.style.left = `${Math.max(0, currentPercent - previewPercent)}%`;
        hpPreview.style.width = `${Math.min(currentPercent, previewPercent)}%`;
        hpPreview.setAttribute("aria-label", `Approximate HP loss: ${Math.round(previewDamage)}`);
        hpTrack.appendChild(hpPreview);
      }

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

      // Yellow preview marks the stamina a selected move would consume.
      const selectedForUnit = currentActor?.id === unit.id && unit.team === "hero" && pendingMoveId
        ? getMove(pendingMoveId)
        : null;
      if (selectedForUnit && selectedForUnit.cost > 0) {
        const staPreview = document.createElement("span");
        staPreview.className = "roster-sta-preview";
        const currentPercent = Math.max(0, Math.min(100, unit.sta / unit.maxSta * 100));
        const costPercent = Math.min(unit.sta, getMoveCost(unit, selectedForUnit)) / unit.maxSta * 100;
        staPreview.style.left = `${Math.max(0, currentPercent - costPercent)}%`;
        staPreview.style.width = `${Math.min(currentPercent, costPercent)}%`;
        staPreview.setAttribute("aria-label", `Stamina cost preview: ${getMoveCost(unit, selectedForUnit)}`);
        staTrack.appendChild(staPreview);
      }

      const staValue = document.createElement("span");
      staValue.className = "roster-value";
      staValue.textContent = `${Math.ceil(unit.sta)}`;
      staLine.append(staLabel, staTrack, staValue);

      // Show HP and stamina for every hero, and HP only for enemies.
      vitals.appendChild(hpLine);
      if (unit.team === "hero") vitals.appendChild(staLine);
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
    img.classList.add("portrait-" + unit.id);
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

function getUnitActiveEffects(unit) {
  const effects = [];
  if (unit.damageBoost > 0) effects.push({
    type: "buff", name: "Pep Talk",
    description: `Damage increased by ${Math.ceil(unit.damageBoost * 100)}% for their next attack.`
  });
  if (unit.protectedUntilAttack) effects.push({
    type: "buff", name: "S.H.I.E.L.D",
    description: "Blocks the next incoming attack completely, then protection wears off."
  });
  if (unit.stunPrimed) effects.push({
    type: "buff", name: "Stun ready",
    description: "Their next attack has a 75% chance to stun the target and make them lose their next action."
  });
  if (unit.attackDebuffTurns > 0) effects.push({
    type: "debuff", name: "Attack reduced",
    description: "Attack is reduced by 50% until this character takes their next action."
  });
  if (unit.stunned) effects.push({
    type: "debuff", name: "Stunned",
    description: "This character loses their next action."
  });
  for (const [key, label, type, description] of [
    ["strengthened", "Strengthened", "buff", "Attack increased by 25%."],
    ["superCrit", "Super Crit", "buff", "Next attack deals double damage; a dodge consumes it."],
    ["lucky", "Lucky", "buff", "Next successful attack is guaranteed to critically hit."],
    ["stealth", "Stealth", "buff", "40% chance to dodge incoming attacks."],
    ["armor", "Protection", "buff", "Defense increased by 25%."],
    ["armorDamageReduction", "Armor", "buff", "Damage taken is reduced by 20%."],
    ["squirrelly", "Squirrelly", "buff", "Next attack gains an extra hit for 50% of total attack damage."],
    ["attention", "Attention", "buff", "Redirects single-target attacks away from allies to this character."],
    ["weakened", "Weakened", "debuff", "Next attack deals 50% less damage."],
    ["bleed", "Bleed", "debuff", "Takes 4% of max HP damage at end of turn."],
    ["confused", "Confused", "debuff", "40% chance offensive abilities target a living teammate."],
    ["burn", "Burn", "debuff", "Takes 4% of max HP damage at end of turn."],
    ["slow", "Slow", "debuff", "Evasion reduced by 20%."],
    ["fear", "Fear", "debuff", "Attacks are 20% less likely to hit."],
    ["monkeyJoe", "Monkey Joe", "debuff", "Takes 5% of max HP damage at end of turn."]
  ]) {
    const value = unit.effects?.[key];
    if (value === true || (typeof value === "number" && value > 0)) {
      effects.push({
        type, name: label,
        description: typeof value === "number" ? `${description} (${value} turn(s) left.)` : description
      });
    }
  }
  return effects;
}

function renderTeam(containerId, units) {
  const container = $(containerId);
  container.dataset.count = String(units.length);
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
      unit.team === "enemy" && unit.alive && !!pendingMoveId && getMove(pendingMoveId)?.type === "attack" && ["enemy", "all-enemies"].includes(getMove(pendingMoveId)?.target) ? "enemy-target-preview" : "",
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

    // Keep every character nameplate visible at all times.
    const activeEffects = getUnitActiveEffects(unit);
    const buffs = activeEffects.filter(effect => effect.type === "buff");
    const debuffs = activeEffects.filter(effect => effect.type === "debuff");
    const showNameplate = true;

    if (showNameplate) {
      const nameplate = document.createElement("div");
      nameplate.className = "unit-nameplate";
      nameplate.setAttribute("role", "button");
      nameplate.setAttribute("tabindex", "0");
      nameplate.setAttribute("aria-label", `Show ${unit.name} buffs and debuffs`);
      nameplate.append(name, hpBar);

      if (buffs.length || debuffs.length) {
        const statusBoxes = document.createElement("div");
        statusBoxes.className = "unit-effect-indicators";
        if (buffs.length) {
          const buffBox = document.createElement("span");
          buffBox.className = "unit-effect-indicator buff";
          buffBox.setAttribute("aria-label", `${buffs.length} buff(s)`);
          buffBox.title = `${buffs.length} active buff(s)`;
          statusBoxes.appendChild(buffBox);
        }
        if (debuffs.length) {
          const debuffBox = document.createElement("span");
          debuffBox.className = "unit-effect-indicator debuff";
          debuffBox.setAttribute("aria-label", `${debuffs.length} debuff(s)`);
          debuffBox.title = `${debuffs.length} active debuff(s)`;
          statusBoxes.appendChild(debuffBox);
        }
        nameplate.appendChild(statusBoxes);
      }

      const showEffects = event => {
        event.stopPropagation();
        openEffectsInfo(unit.name, buffs, debuffs, unit.id);
      };
      nameplate.addEventListener("click", showEffects);
      nameplate.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showEffects(event);
        }
      });
      card.append(nameplate, portrait, status);
    } else {
      card.append(portrait, status);
    }

    card.addEventListener("click", () => {
      inspectedUnitId = unit.id;
      selectUnit(unit);
      renderAll();
    });
    card.addEventListener("keydown", event => {
      if (event.target.closest(".unit-nameplate")) return;
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

function openEffectsInfo(unitName, buffs, debuffs, unitId) {
  const overlay = $("effectsInfoOverlay");
  const card = overlay.querySelector(".move-info-card");
  $("effectsInfoTitle").textContent = `${unitName} — Active Effects`;
  $("effectsInfoDescription").textContent = "All buffs and debuffs currently affecting this character.";
  const list = $("effectsInfoList");
  list.replaceChildren();

  const addGroup = (label, kind, effects) => {
    if (!effects.length) return;
    const heading = document.createElement("h3");
    heading.className = `effects-info-heading ${kind}`;
    heading.textContent = label;
    list.appendChild(heading);
    for (const effect of effects) {
      const item = document.createElement("div");
      item.className = "effects-info-item";
      const name = document.createElement("strong");
      name.textContent = effect.name;
      const description = document.createElement("p");
      description.textContent = effect.description;
      item.append(name, description);
      list.appendChild(item);
    }
  };
  addGroup("Buffs", "buff", buffs);
  addGroup("Debuffs", "debuff", debuffs);
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => {
    const viewportPad = 12;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || window.innerWidth;
    const viewportHeight = viewport?.height || window.innerHeight;
    const viewportLeft = viewport?.offsetLeft || 0;
    const viewportTop = viewport?.offsetTop || 0;
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const cardWidth = Math.min(isMobile ? 180 : 300, viewportWidth - viewportPad * 2);
    const cardMaxHeight = Math.min(viewportHeight * (isMobile ? 0.52 : 0.72), viewportHeight - viewportPad * 2);

    card.style.position = "fixed";
    card.style.width = `${cardWidth}px`;
    card.style.maxWidth = `calc(100vw - ${viewportPad * 2}px)`;
    card.style.maxHeight = `${cardMaxHeight}px`;
    card.style.overflowY = "auto";
    card.style.margin = "0";
    card.style.left = `${viewportLeft + viewportWidth / 2}px`;
    card.style.top = `${viewportTop + viewportHeight / 2}px`;
    card.style.right = "auto";
    card.style.bottom = "auto";
    card.style.transform = "translate(-50%, -50%)";
  });
}

function closeEffectsInfo() {
  $("effectsInfoOverlay").classList.add("hidden");
  // Closing the details window must not alter any active effect or its marker.
}

function moveIconGlyph(moveId) {
  if (moveId === "stormbreaker") return "🔨";
  if (moveId === "thunderstruck" || moveId === "lightning-strike") return "⚡";
  if (moveId === "flying-kick-bill" || moveId === "kick") return "➤";
  return moveId === "combo" ? "⚔" : moveId === "bite" ? "⚡" : "◎";
}

function renderMoveDock() {
  const dock = $("moveDock");
  if (!dock) return;
  dock.innerHTML = "";
  for (const move of getMovesForUnit(currentActor)) {
    const actor = currentActor;
    const hero = actor && actor.team === "hero" ? actor : null;
    const cooldown = hero ? (hero.cooldowns[move.id] || 0) : 0;
    const affordable = !!hero && hero.sta >= getMoveCost(hero, move);
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
    details.append(moveName);
    button.classList.add(move.type === "attack" ? "attack-move" : "buff-debuff-move");
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
    ["BASE DAMAGE", move.damage > 0 ? (move.hits > 1 ? `${formatCombatNumber(move.damage / move.hits)} × ${move.hits} hits` : formatCombatNumber(move.damage)) : "—"],
    ["STAMINA", formatCombatNumber(getMoveCost(hero, move))],
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
    if (unit.team === "enemy") selectedTargetId = unit.id;
    else selectedHeroId = unit.id;
    inspectedUnitId = unit.id;
    renderAll();
    return;
  }
  const move = getMove(pendingMoveId);
  if (!move) return;

  // Self-targeting buffs are activated by tapping the acting character,
  // rather than selecting an enemy or another ally.
  if (move.target === "self") {
    if (unit.id !== currentActor.id) {
      log("Tap the acting character to use this self-targeting move.", "miss");
      return;
    }
    const moveId = pendingMoveId;
    pendingMoveId = null;
    useMove(moveId, currentActor);
    return;
  }

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
    applyEndOfTurnDamage(unit);
    expireTurnEffects(unit);

    if (unit.attackDebuffTurns > 0) {
      unit.attackDebuffTurns--;
      if (unit.attackDebuffTurns === 0) {
        syncEffectStats(unit);
      }
    }

    log(`${unit.name} is stunned and loses their turn!`, "miss");
    renderAll();

    turnIndex++;
    window.setTimeout(nextTurn, 750);
    return;
  }

  if (unit.effects?.darkforceDimension > 0) { applyEndOfTurnDamage(unit); expireTurnEffects(unit); turnIndex++; renderAll(); window.setTimeout(nextTurn, 700); return; }

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
  // Every melee-style attack (unarmed, spin, or flying) lunges toward
  // the actual target card, including attacks that also damage multiple enemies.
  // Ranged attacks stay in place and use their ranged animation.
  const move = getMove(animatingMoveId);
  const attackType = String(move?.attackType || "");
  const isMelee = attackType.includes("melee");
  // Use the same travel distance for every melee attacker whenever the
  // target is far enough away. Only shorten it when needed to avoid crossing
  // into the target card, so the roster shares one consistent movement pace.
  const availableTravel = Math.max(0, distance - Math.min(targetRect.width * 0.42, 70));
  // Slightly shorten the lunge so the approach feels less abrupt on mobile.
  const travel = isMelee ? Math.min(95, availableTravel) : 0;
  const x = dx / distance * travel;
  const y = dy / distance * travel;

  actorCard.style.setProperty("--attack-x", `${x}px`);
  actorCard.style.setProperty("--attack-y", `${y}px`);
  actorCard.style.setProperty("--target-x", `${dx}px`);
  actorCard.style.setProperty("--target-y", `${dy}px`);

  // Drive the lunge directly on the rendered attacker card. Some formation
  // slots (including the top character on each side) have a CSS `translate: ... !important`
  // offset for positioning. Animating the independent translate property loses
  // to that important rule, leaving only the scale visible. Put the lunge's
  // movement in transform instead; the slot's CSS translate offset is preserved.
  if (isMelee) {
    actorCard.getAnimations().forEach(animation => animation.cancel());
    actorCard.animate([
      { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" },
      { transform: `translate(${x * 0.72}px, ${y * 0.72}px) scale(1.08)`, filter: "brightness(1.25)", offset: 0.24 },
      { transform: `translate(${x}px, ${y}px) scale(1.16)`, filter: "brightness(1.75) saturate(1.25)", offset: 0.42 },
      { transform: `translate(${x}px, ${y}px) scale(1.16)`, filter: "brightness(1.75) saturate(1.25)", offset: 0.54 },
      { transform: `translate(${x * 0.88}px, ${y * 0.88}px) scale(1.08)`, filter: "brightness(1.3)", offset: 0.68 },
      { transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" }
    ], { duration: 1280, easing: "cubic-bezier(.18,.78,.22,1)", fill: "both" });
  }
}

function showDestroyerPrototypeImage() {
  const battlefield = document.querySelector(".battlefield");
  const philCard = document.querySelector('.unit[data-unit-id="phil"]');
  if (!battlefield || !philCard) return;
  const previous = battlefield.querySelector(".destroyer-prototype-image");
  if (previous) previous.remove();

  const battlefieldRect = battlefield.getBoundingClientRect();
  const philRect = philCard.getBoundingClientRect();
  const image = document.createElement("img");
  image.className = "destroyer-prototype-image";
  image.src = "../assets/Phil%20Gun.png";
  image.alt = "Phil Coulson's Destroyer Prototype";
  image.setAttribute("aria-hidden", "true");
  Object.assign(image.style, {
    position: "absolute",
    left: `${philRect.left - battlefieldRect.left + philRect.width * 0.76}px`,
    top: `${philRect.top - battlefieldRect.top + philRect.height * 0.08}px`,
    transform: "scale(0.85)",
    transformOrigin: "left top",
    width: "min(30%, 190px)",
    maxHeight: "38%",
    objectFit: "contain",
    zIndex: "30",
    pointerEvents: "none",
    opacity: "0",
    filter: "drop-shadow(0 0 9px rgba(255, 180, 55, 0.7))",
    transition: "opacity 120ms ease, transform 180ms ease"
  });
  battlefield.appendChild(image);
  requestAnimationFrame(() => {
    image.style.opacity = "1";
    image.style.transform = "scale(1)";
  });
  // Hold the weapon image on screen during the one-second wind-up.
  window.setTimeout(() => {
    image.style.opacity = "0";
    image.style.transform = "scale(1.05)";
    window.setTimeout(() => image.remove(), 180);
  }, 1150);
}

function showBattleVanAnimation() {
  const battlefield = document.querySelector(".battlefield");
  if (!battlefield) return;
  const field = battlefield.getBoundingClientRect();
  const vanWidth = Math.max(150, Math.min(field.width * 0.62, 520));
  const duration = 1750;
  const van = document.createElement("img");
  van.src = "../assets/Battle%20van.png";
  van.alt = "";
  van.setAttribute("aria-hidden", "true");
  Object.assign(van.style, {
    position: "fixed",
    left: (field.left - vanWidth) + "px",
    top: (field.top + field.height / 2) + "px",
    width: vanWidth + "px",
    maxHeight: Math.min(field.height * 0.62, window.innerHeight * 0.42) + "px",
    objectFit: "contain",
    zIndex: "99998",
    pointerEvents: "none",
    transform: "translate3d(0, -50%, 0)",
    willChange: "transform"
  });
  document.body.appendChild(van);
  const animation = van.animate([
    { transform: "translate3d(0, -50%, 0)" },
    { transform: `translate3d(${field.width + vanWidth + 2}px, -50%, 0)` }
  ], {
    duration,
    easing: "linear",
    fill: "forwards"
  });
  window.battleVanDamageDelayUntil = Date.now() + duration + 80;
  animation.onfinish = () => van.remove();
  van.onerror = () => van.remove();
}

function triggerCombatAnimation(actor, target, move) {
  if (actor.id === "punisher" && move?.id === "battle-van") {
    // This move is represented entirely by the van; suppress Punisher's
    // portrait lunge/attack effect and the usual combat animation state.
    showBattleVanAnimation();
    animatingActorId = null;
    animatingTargetId = null;
    animatingMoveId = null;
    animatingMode = null;
    const token = ++animationToken;
    window.setTimeout(() => {
      if (token !== animationToken) return;
      renderAll();
    }, 1280);
    return;
  }
  const isBuffAnimation = move && (move.type === "buff" || move.type === "protect");
  if (isBuffAnimation) {
    // Support effects should glow on the recipient, not travel toward an enemy.
    const recipient = move.target === "self" || move.target === "all-allies"
      ? actor
      : (target || actor);
    animatingActorId = recipient.id;
    animatingTargetId = null;
    animatingMoveId = null;
    animatingMode = "buff";
  } else {
    animatingActorId = actor.id;
    animatingTargetId = target?.id || null;
    animatingMoveId = move ? move.id : null;
    animatingMode = move?.target === "all-enemies" && !String(move?.attackType || "").includes("melee") ? "sweep" : null;
  }
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

function showSniperResult(hit) {
  const indicator = document.createElement("div");
  indicator.className = "sniper-result " + (hit ? "sniper-hit" : "sniper-miss");
  indicator.textContent = hit ? "HIT" : "MISS";
  indicator.setAttribute("role", "status");
  indicator.setAttribute("aria-live", "assertive");
  document.body.appendChild(indicator);
  window.setTimeout(() => indicator.remove(), 1200);
}

function showDamageNumber(target, amount, critical = false, missed = false, delay = 80) {
  // Battle Van must fully clear the battlefield before its damage appears.
  const vanWait = Math.max(0, (window.battleVanDamageDelayUntil || 0) - Date.now());
  delay = Math.max(delay, vanWait);
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
  const moveCost = getMoveCost(actor, move);
  if (actor.sta < moveCost) { log(`${actor.name} doesn't have enough stamina.`, "miss"); return; }
  if ((actor.cooldowns[move.id] || 0) > 0) { log(`${move.name} is still on cooldown.`, "miss"); return; }

  const targetTeam = ["ally","all-allies"].includes(move.target) ? heroes : enemies;
  const requiresTarget = ["enemy","ally","all-enemies","all-allies"].includes(move.target);
  const target = !requiresTarget ? null : (chosenTarget && chosenTarget.alive && targetTeam.some(unit => unit.id === chosenTarget.id)
    ? chosenTarget : targetTeam.find(unit => unit.id === selectedTargetId && unit.alive));
  if (["enemy","ally","all-enemies","all-allies"].includes(move.target) && !target) {
    log(["ally","all-allies"].includes(move.target) ? "Select a living ally first." : "Select a living enemy first.", "miss");
    return;
  }

  // Give Destroyer Prototype a one-second visual wind-up before its attack resolves.
  // Keep the primed flag set until the recursive call reaches this point, so it
  // proceeds to the attack instead of restarting the wind-up forever.
  if (actor.id === "phil" && move.id === "destroyer-prototype") {
    if (!destroyerPrototypePrimed) {
      destroyerPrototypePrimed = true;
      waitingForEnemy = true;
      showDestroyerPrototypeImage();
      renderAll();
      window.setTimeout(() => {
        waitingForEnemy = false;
        useMove(moveId, target);
      }, 1000);
      return;
    }
    destroyerPrototypePrimed = false;
  }

  actor.sta -= moveCost;
  pendingMoveId = null;
  if (target) selectedTargetId = target.id;
  const animationTarget = target || enemies.find(unit => unit.alive);
  if (animationTarget) triggerCombatAnimation(actor, animationTarget, move);

  if (move.target === "all-enemies") {
    performAttackOnTargets(actor, enemies.filter(unit => unit.alive), move);
    if (move.cooldown > 0) actor.cooldowns[move.id] = move.cooldown;
   } else if (move.target === "all-allies" && !move.buffs) {
    for (const ally of heroes.filter(unit => unit.alive)) ally.damageBoost = Math.max(ally.damageBoost || 0, 0.2);
    actor.cooldowns[move.id] = move.cooldown;
    log(`${actor.name} uses Pep Talk! All living allies, including ${actor.name}, gain a 20% damage boost for their next attack.`, "good");
  } else if (move.type === "protect") {
    const protectedAllies = target && target.alive ? [target] : [];
    for (const ally of protectedAllies) ally.protectedUntilAttack = true;
    actor.cooldowns[move.id] = move.cooldown;
    log(`${actor.name} uses S.H.I.E.L.D! ${protectedAllies.map(ally => ally.name).join(" and ")} is protected from the next attack.`, "good");
  } else if (move.type === "debuff") {
    useWidowmaker(actor, target, move);
  } else if (move.type === "random-effects") {
    const buffPool = ["strengthened","armor","stealth","lucky","superCrit","squirrelly","shielded"];
    const debuffPool = ["bleed","burn","slow","fear","weakened","blind","confused"];
    const allies = heroes.filter(unit => unit.alive);
    const foes = enemies.filter(unit => unit.alive);
    for (let i=0;i<3;i++) {
      if (allies.length) applyEffect(allies[Math.floor(Math.random()*allies.length)],buffPool[Math.floor(Math.random()*buffPool.length)],3);
      if (foes.length) applyEffect(foes[Math.floor(Math.random()*foes.length)],debuffPool[Math.floor(Math.random()*debuffPool.length)],3);
    }
    if (move.cooldown > 0) actor.cooldowns[move.id] = move.cooldown;
    log(`${actor.name} unleashes the Mystery Box!`, "good");
  } else if (move.type === "buff") {
    const recipients = move.target === "all-allies" ? heroes.filter(unit => unit.alive) : [move.target === "self" ? actor : target].filter(Boolean);
    for (const recipient of recipients) {
      for (const buff of move.buffs || []) applyEffect(recipient, buff, move.duration || 1);
      if (move.allStatsBoost) {
        recipient.effects.allStatsBoost = Math.max(recipient.effects.allStatsBoost || 0, move.allStatsBoost);
        recipient.effects.allStatsTurns = move.duration || 3;
        recipient.atk = recipient.baseAtk * (1 + recipient.effects.allStatsBoost) * (recipient.effects.strengthened > 0 ? 1.25 : 1);
        recipient.def = recipient.baseDef * (1 + recipient.effects.allStatsBoost) * (recipient.effects.armor > 0 ? 1.25 : 1);
        recipient.eva = recipient.baseEva * (1 + recipient.effects.allStatsBoost) * (recipient.effects.slow > 0 ? 0.8 : 1);
        recipient.acc = recipient.baseAcc * (1 + recipient.effects.allStatsBoost);
      }
    }
    if (move.freeAction) actor.freeActions = (actor.freeActions || 0) + 1;
    if (move.cooldown > 0) actor.cooldowns[move.id] = move.cooldown;
    log(`${actor.name} uses ${move.name}!`, "good");
  } else if (move.type === "apply-debuff") {
    if (target && move.applyDebuff) applyEffect(target, move.applyDebuff, move.duration || (move.applyDebuff === "monkeyJoe" ? 5 : 3));
    if (move.cooldown > 0) actor.cooldowns[move.id] = move.cooldown;
    log(`${actor.name} uses ${move.name} on ${target?.name || "the target"}!`, "good");
  } else {
    performAttack(actor, target, move);
    if (move.selfDebuff) applyEffect(actor, move.selfDebuff, 1);
    if (move.cooldown > 0) actor.cooldowns[move.id] = move.cooldown;
  }

  applyEndOfTurnDamage(actor);
  if (actor.characterAbilities?.includes("lightforce-cleanse")) {
    for (const key of ["weakened","bleed","confused","burn","slow","fear","monkeyJoe","bleedOut","blind","temporaryDamage","darkforceDimension"]) actor.effects[key] = 0;
    log(`${actor.name}'s Lightforce Cleanse removes all debuffs.`, "good");
  }
  expireTurnEffects(actor);
  renderAll();
  if (checkBattleEnd()) return;
  if (actor.freeActions > 0) {
    actor.freeActions--;
    log(`${actor.name} takes a free action!`, "good");
    window.setTimeout(nextTurn, 700);
    return;
  }
  turnIndex++;
  window.setTimeout(nextTurn, 1550);
}

function doesAttackHit(attacker, target, move) {
  if ((target.effects?.spiderSense > 0 && Math.random() < 0.8) || (target.effects?.stealth > 0 && Math.random() < 0.4)) return false;
  // A 100-point Accuracy advantage over Defense guarantees a hit.
  if (attacker.acc >= target.def + 100) return true;
  let chance = move.accuracy / 100;
  if (attacker.effects?.fear > 0) chance *= 0.8;
  if (attacker.effects?.blind > 0) chance *= 0.6;
  if (attacker.effects?.cantMiss > 0) return true;
  return Math.random() <= chance;
}

function getConfusedTarget(actor, target, move) {
  if (!actor.effects?.confused || actor.effects.confused <= 0) return target;
  const teammates = (actor.team === "hero" ? heroes : enemies).filter(unit => unit.alive && unit.id !== actor.id);
  if (!teammates.length || Math.random() >= 0.4) return target;
  return teammates[Math.floor(Math.random() * teammates.length)];
}

function performAttackOnTargets(actor, targets, move) {
  log(`${actor.name} uses ${move.name} against the enemy formation!`);
  for (const target of targets) {
    if (!target.alive || !actor.alive) continue;
    const hitChance = move.accuracy / 100;
    const actualTarget = getConfusedTarget(actor, target, move);
    if (actualTarget.protectedUntilAttack) {
      actualTarget.protectedUntilAttack = false;
      log(`${actualTarget.name} is protected by S.H.I.E.L.D! The incoming attack deals no damage, and the protection wears off.`, "good");
      continue;
    }
    if (!doesAttackHit(actor, actualTarget, move)) {
      if (move.eliminateNextWave) showSniperResult(false);
      log(`${move.name} misses ${actualTarget.name}!`, "miss");
      if (actor.effects?.superCrit) actor.effects.superCrit = false;
      showDamageNumber(actualTarget, 0, false, true, 100);
      continue;
    }
    const damage = calculateDamage(actor, actualTarget, move);
    if (move.eliminateNextWave) actor.pendingWaveEliminations = (actor.pendingWaveEliminations || 0) + 1;
    if (actor.effects?.superCrit) actor.effects.superCrit = false;
    if (actor.effects?.lucky) actor.effects.lucky = false;
    if (actor.effects?.weakened) actor.effects.weakened = false;
    actualTarget.hp = Math.max(0, actualTarget.hp - damage.amount);
    onUnitDamaged(actualTarget);
    showDamageNumber(actualTarget, damage.amount, damage.critical, false, 100);
    log(`${damage.critical ? "CRITICAL! " : ""}${actualTarget.name} takes ${Math.ceil(damage.amount)} damage.`, "damage");
    if (move.applyDebuff && Math.random() < (move.debuffChance || 100) / 100) {
      if (actualTarget.characterAbilities?.includes("bulletproof-skin") && ["burn","bleed","bleedOut"].includes(move.applyDebuff)) log(`${actualTarget.name}'s Bulletproof Skin blocks ${move.applyDebuff}.`, "good");
      else if (move.applyDebuff === "stun") actualTarget.stunned = true;
      else applyEffect(actualTarget, move.applyDebuff, move.applyDebuff === "monkeyJoe" ? 5 : 3);
    }
    if (move.secondaryDebuff && Math.random() < (move.secondaryDebuffChance || 100) / 100) applyEffect(actualTarget, move.secondaryDebuff, 3);
    if (move.bleedOthersOnly) {
      const otherEnemies = (actualTarget.team === "hero" ? heroes : enemies)
        .filter(unit => unit.alive && unit.id !== actualTarget.id);
      for (const other of otherEnemies) applyEffect(other, "bleed", 3);
    }
    if (move.removeBuffs) removeAllBuffs(actualTarget);
    if (actualTarget.hp <= 0) {
      resolveDefeat(actualTarget);
    } else if (move.stunChance && Math.random() < move.stunChance / 100) {
      actualTarget.stunned = true;
      log(`${actualTarget.name} is stunned and will lose their next action!`, "good");
    }
  }
  if (actor.team === "hero" && actor.damageBoost > 0) {
    actor.damageBoost = 0;
    log(`${actor.name} uses up the Pep Talk boost.`, "good");
  }
}
function useWidowmaker(actor, target, move) {
  target.attackDebuffTurns = 1;
  syncEffectStats(target);
  target.atk = target.baseAtk * 0.5 * (target.effects?.strengthened > 0 ? 1.25 : 1);
  actor.stunPrimed = true;
  actor.cooldowns[move.id] = move.cooldown;
  log(`${actor.name} uses Widowmaker! ${target.name}'s Attack is reduced by 50% until their next action.`, "good");
  log(`${actor.name}'s next attack has a 75% chance to stun its target.`);
}
function performAttack(actor, target, move) {
  log(`${actor.name} uses ${move.name} on ${target.name}.`);
  const confusedTarget = getConfusedTarget(actor, target, move);
  const actualTarget = redirectSingleTarget(actor, confusedTarget, move);
  if (move.superCritChance && Math.random() < move.superCritChance / 100) actor.effects.superCrit = true;
  let totalDamage = 0;
  let hitAny = false;
  for (let hitNumber = 1; hitNumber <= move.hits; hitNumber++) {
    if (!actualTarget.alive || !actor.alive) break;
    if (actualTarget.protectedUntilAttack) {
      actualTarget.protectedUntilAttack = false;
      log(`${actualTarget.name} is protected by S.H.I.E.L.D! The incoming attack deals no damage, and the protection wears off.`, "good");
      break;
    }
    if (!doesAttackHit(actor, actualTarget, move)) {
      log(`${move.name} misses ${actualTarget.name}!`, "miss");
      // Super Crit is consumed by a dodge; Lucky remains until an attack lands.
      if (actor.effects?.superCrit) actor.effects.superCrit = false;
      showDamageNumber(actualTarget, 0, false, true, 80 + (hitNumber - 1) * 480);
      continue;
    }
    hitAny = true;
    if (move.eliminateNextWave) {
      actor.pendingWaveEliminations = (actor.pendingWaveEliminations || 0) + 1;
      showSniperResult(true);
      if (actor.effects?.superCrit) actor.effects.superCrit = false;
      if (actor.effects?.lucky) actor.effects.lucky = false;
      log(`${move.name} hits! One enemy will be removed from the next wave.`, "good");
      break;
    }
    const damage = calculateDamage(actor, actualTarget, move);
    if (actor.effects?.superCrit) actor.effects.superCrit = false;
    if (actor.effects?.lucky) actor.effects.lucky = false;
    if (actor.effects?.weakened) actor.effects.weakened = false;
    const amount = damage.amount;
    actualTarget.hp = Math.max(0, actualTarget.hp - amount);
    onUnitDamaged(actualTarget);
    totalDamage += amount;
    showDamageNumber(actualTarget, amount, damage.critical, false, 80 + (hitNumber - 1) * 480);
    log(`${damage.critical ? "CRITICAL! " : ""}${actualTarget.name} takes ${Math.ceil(amount)} damage.`, "damage");
    if (actor.stunPrimed) {
      actor.stunPrimed = false;
      if (Math.random() < 0.75 && actualTarget.alive) {
        actualTarget.stunned = true;
        log(`${actualTarget.name} is stunned and will lose their next action!`, "good");
      } else log("The stun attempt fails.");
    }
    if (move.applyDebuff && Math.random() < (move.debuffChance || 100) / 100) {
      if (move.applyDebuff === "stun") actualTarget.stunned = true;
      else applyEffect(actualTarget, move.applyDebuff, move.applyDebuff === "monkeyJoe" ? 5 : 3);
    }
    if (move.bleedOthersOnly) {
      const otherEnemies = (actualTarget.team === "hero" ? heroes : enemies)
        .filter(unit => unit.alive && unit.id !== actualTarget.id);
      for (const other of otherEnemies) applyEffect(other, "bleed", 3);
    }
    if (actualTarget.hp <= 0) {
      resolveDefeat(actualTarget);
    }
  }
  if (move.removeBuffs && actualTarget.alive && hitAny) removeAllBuffs(actualTarget);
  // Squirrelly adds one separate bonus hit worth 50% of the attack's total damage.
  if (hitAny && totalDamage > 0 && actor.effects?.squirrelly > 0 && actualTarget.alive) {
    const bonus = totalDamage * 0.5;
    actualTarget.hp = Math.max(0, actualTarget.hp - bonus);
    showDamageNumber(actualTarget, bonus, false, false, 80 + move.hits * 480);
    log(`Squirrelly adds a bonus hit! ${actualTarget.name} takes ${Math.ceil(bonus)} additional damage.`, "damage");
    actor.effects.squirrelly = 0;
    if (actualTarget.hp <= 0) {
      resolveDefeat(actualTarget);
    }
  }
  // Weakened is consumed by the next offensive ability, even if it misses.
  if (actor.effects?.weakened) actor.effects.weakened = false;
  if (actor.team === "hero" && actor.damageBoost > 0 && hitAny) {
    actor.damageBoost = 0;
    log(`${actor.name} uses up the Pep Talk boost.`, "good");
  }
}
function calculateDamage(attacker, target, move) {
  const attackVsDefense = attacker.atk > target.def ? "higher"
    : attacker.atk < target.def ? "lower" : "equal";
  const accuracyVsDefense = attacker.acc > target.def ? "higher"
    : attacker.acc < target.def ? "lower" : "equal";
  const ranges = {
    higher: { higher: [0.02, 0.20], equal: [-0.02, 0.15], lower: [-0.02, 0.10] },
    equal: { higher: [-0.05, 0.15], equal: [-0.15, 0.15], lower: [-0.15, 0.10] },
    lower: { higher: [-0.10, 0.10], equal: [-0.15, 0.02], lower: [-0.20, -0.02] }
  };
  const [varianceMin, varianceMax] = ranges[attackVsDefense][accuracyVsDefense];
  const variance = varianceMin + Math.random() * (varianceMax - varianceMin);

  let amount = move.damage / move.hits;
  amount *= 1 + variance;
  if (attacker.team === "enemy") amount *= 1 + (wave - 1) * 0.01;
  amount *= 1 + (attacker.damageBoost || 0);
  if (attacker.effects?.weakened) amount *= 0.5;

  const accuracyAdvantage = attacker.acc - target.def;
  let critBonus = 0;
  if (accuracyAdvantage > 0 && accuracyAdvantage <= 10) critBonus = 2;
  else if (accuracyAdvantage > 10 && accuracyAdvantage <= 25) critBonus = 5;
  else if (accuracyAdvantage > 25 && accuracyAdvantage < 50) critBonus = 7;
  else if (accuracyAdvantage >= 50) critBonus = 10;
  const criticalChance = Math.min(100, move.crit + critBonus + (attacker.characterAbilities?.includes("marksman") ? 20 : 0));
  const guaranteedCrit = !!attacker.effects?.lucky;
  const superCrit = !!attacker.effects?.superCrit;
  const critical = guaranteedCrit || Math.random() < criticalChance / 100;
  if (superCrit) {
    amount *= 2;
    // Lucky lets a Super Crit retain the normal critical multiplier as well.
    if (guaranteedCrit) amount *= 1.15 + Math.random() * 0.10;
  } else if (critical) amount *= 1.15 + Math.random() * 0.10;

  if (target.effects?.armorDamageReduction > 0) amount *= 0.8;
  return { amount: Math.max(1, Math.round(amount * 10) / 10), critical };
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

  const availableMoves = getMovesForUnit(actor).filter(move =>
    move.type === "attack" &&
    actor.sta >= getMoveCost(actor, move) &&
    (actor.cooldowns[move.id] || 0) === 0
  );

  if (availableMoves.length === 0) {
    log(`${actor.name} has insufficient stamina and skips their attack.`);
  } else {
    // Enemies choose an affordable attack from their available abilities.
    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    actor.sta -= getMoveCost(actor, move);
    triggerCombatAnimation(actor, target, move);
    if (move.target === "all-enemies") performAttackOnTargets(actor, heroes.filter(hero => hero.alive), move);
    else performAttack(actor, target, move);
  }

  if (actor.attackDebuffTurns > 0) {
    actor.attackDebuffTurns--;

    if (actor.attackDebuffTurns === 0) {
      actor.atk = actor.baseAtk;
      log(`${actor.name}'s Attack returns to normal.`);
    }
  }

  applyEndOfTurnDamage(actor);
  expireTurnEffects(actor);
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

  if (heroesAlive && !enemiesAlive && wave < TOTAL_WAVES && !practiceMode) {
    beginNextWave();
    return true;
  }

  battleOver = true;
  waitingForEnemy = false;

  const victory = heroesAlive;

  $("resultTitle").textContent = victory ? "VICTORY!" : "DEFEAT";
  $("resultTitle").style.color =
    victory ? "var(--gold)" : "var(--red)";

  $("resultMessage").textContent = practiceMode
    ? (victory ? `You defeated ${enemies[0]?.name || "your opponent"}! Practice complete.` : `Your team was defeated by ${enemies[0]?.name || "your opponent"}.`)
    : (victory ? "Hydra has been defeated. Your team wins the battle!" : "Your entire team has been defeated by Hydra.");

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
  const skippedActor = currentActor;
  const staminaRestored = skippedActor.maxSta * 0.5;
  const staminaBefore = skippedActor.sta;
  skippedActor.sta = Math.min(skippedActor.maxSta, skippedActor.sta + staminaRestored);
  const actualRestored = skippedActor.sta - staminaBefore;
  log(`${skippedActor.name} skips their turn and restores ${Math.ceil(actualRestored)} stamina.`, "good");
  renderAll();
  turnIndex++;
  nextTurn();
});

$("restartBtn").addEventListener("click", resetBattle);
$("closeMoveInfoBtn").addEventListener("click", closeMoveInfo);
$("closeEffectsInfoBtn").addEventListener("click", closeEffectsInfo);
$("effectsInfoOverlay").addEventListener("click", event => {
  if (event.target === $("effectsInfoOverlay")) closeEffectsInfo();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeEffectsInfo();
    if (!$("moveInfoOverlay").classList.contains("hidden")) closeMoveInfo();
  }
});
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
$("playAgainBtn").addEventListener("click", () => {
  const lostBattle = !heroes.some(hero => hero.alive);
  if (lostBattle) {
    window.location.href = "../";
    return;
  }
  resetBattle();
});

$("clearLogBtn").addEventListener("click", () => {
  $("battleLog").innerHTML = "";
});

resetBattle();
