"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  level: document.getElementById("levelText"),
  lives: document.getElementById("livesText"),
  weapon: document.getElementById("weaponText"),
  score: document.getElementById("scoreText"),
  overlay: document.getElementById("overlay"),
  overlayTitle: document.getElementById("overlayTitle"),
  overlayText: document.getElementById("overlayText"),
  startBtn: document.getElementById("startBtn"),
  loadBtn: document.getElementById("loadBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  saveBtn: document.getElementById("saveBtn"),
  resetBtn: document.getElementById("resetBtn")
};

const SAVE_KEY = "metalFrontSaveV1";
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const FLOOR = 616;
const GRAVITY = 0.9;

const LEVELS = [
  {
    name: "港口突入",
    length: 2550,
    sky: ["#26384a", "#18212d"],
    ground: "#57422d",
    platforms: [
      { x: 430, y: 500, w: 180, h: 18 },
      { x: 930, y: 440, w: 220, h: 18 },
      { x: 1450, y: 488, w: 190, h: 18 },
      { x: 1920, y: 420, w: 240, h: 18 }
    ],
    checkpoints: [620, 1320, 2020],
    spawnEvery: 1550,
    enemyCap: 7,
    enemies: [
      { x: 720, type: "rifle" },
      { x: 1080, type: "runner" },
      { x: 1550, type: "shield" },
      { x: 2050, type: "rifle" }
    ],
    pickups: [
      { x: 870, type: "spread" },
      { x: 1710, type: "heal" }
    ],
    boss: { x: 2380, hp: 90, type: "turret" }
  },
  {
    name: "叢林補給線",
    length: 2900,
    sky: ["#253b2f", "#16241d"],
    ground: "#4b5030",
    platforms: [
      { x: 500, y: 492, w: 210, h: 18 },
      { x: 1040, y: 430, w: 180, h: 18 },
      { x: 1540, y: 500, w: 260, h: 18 },
      { x: 2200, y: 438, w: 220, h: 18 }
    ],
    checkpoints: [760, 1580, 2320],
    spawnEvery: 1350,
    enemyCap: 8,
    enemies: [
      { x: 620, type: "runner" },
      { x: 1120, type: "rifle" },
      { x: 1500, type: "runner" },
      { x: 1980, type: "shield" },
      { x: 2360, type: "rifle" }
    ],
    pickups: [
      { x: 980, type: "laser" },
      { x: 1880, type: "grenades" }
    ],
    boss: { x: 2720, hp: 120, type: "walker" }
  },
  {
    name: "沙漠列車",
    length: 3200,
    sky: ["#5b4736", "#241e1b"],
    ground: "#6d563b",
    platforms: [
      { x: 560, y: 496, w: 200, h: 18 },
      { x: 1120, y: 452, w: 260, h: 18 },
      { x: 1780, y: 504, w: 220, h: 18 },
      { x: 2440, y: 424, w: 250, h: 18 }
    ],
    checkpoints: [850, 1680, 2520],
    spawnEvery: 1250,
    enemyCap: 9,
    enemies: [
      { x: 760, type: "rifle" },
      { x: 1160, type: "shield" },
      { x: 1650, type: "runner" },
      { x: 2170, type: "rifle" },
      { x: 2620, type: "shield" }
    ],
    pickups: [
      { x: 1240, type: "rocket" },
      { x: 2110, type: "heal" }
    ],
    boss: { x: 3020, hp: 150, type: "cannon" }
  },
  {
    name: "雪地碉堡",
    length: 3450,
    sky: ["#3e5564", "#18242b"],
    ground: "#61717a",
    platforms: [
      { x: 520, y: 486, w: 230, h: 18 },
      { x: 1160, y: 426, w: 190, h: 18 },
      { x: 1760, y: 502, w: 270, h: 18 },
      { x: 2480, y: 446, w: 260, h: 18 },
      { x: 2940, y: 386, w: 190, h: 18 }
    ],
    checkpoints: [910, 1860, 2760],
    spawnEvery: 1150,
    enemyCap: 10,
    enemies: [
      { x: 700, type: "runner" },
      { x: 1160, type: "rifle" },
      { x: 1570, type: "shield" },
      { x: 2150, type: "rifle" },
      { x: 2680, type: "runner" },
      { x: 3040, type: "shield" }
    ],
    pickups: [
      { x: 1440, type: "spread" },
      { x: 2460, type: "laser" }
    ],
    boss: { x: 3260, hp: 180, type: "bunker" }
  },
  {
    name: "核心基地",
    length: 3800,
    sky: ["#2f2c39", "#111218"],
    ground: "#3f4248",
    platforms: [
      { x: 500, y: 490, w: 230, h: 18 },
      { x: 1080, y: 430, w: 210, h: 18 },
      { x: 1620, y: 500, w: 260, h: 18 },
      { x: 2250, y: 438, w: 230, h: 18 },
      { x: 2860, y: 382, w: 250, h: 18 },
      { x: 3320, y: 472, w: 220, h: 18 }
    ],
    checkpoints: [960, 1980, 3040],
    spawnEvery: 1000,
    enemyCap: 12,
    enemies: [
      { x: 720, type: "rifle" },
      { x: 1120, type: "runner" },
      { x: 1500, type: "shield" },
      { x: 2010, type: "rifle" },
      { x: 2450, type: "runner" },
      { x: 2920, type: "shield" },
      { x: 3260, type: "rifle" }
    ],
    pickups: [
      { x: 1320, type: "rocket" },
      { x: 2250, type: "heal" },
      { x: 2920, type: "grenades" }
    ],
    boss: { x: 3600, hp: 240, type: "core" }
  }
];

const WEAPONS = {
  rifle: { label: "步槍", cooldown: 160, speed: 14, damage: 12, count: 1, spread: 0, ammo: Infinity, color: "#f4efe6" },
  spread: { label: "散彈", cooldown: 260, speed: 12, damage: 10, count: 5, spread: 0.28, ammo: 90, color: "#f2c94c" },
  laser: { label: "雷射", cooldown: 110, speed: 18, damage: 16, count: 1, spread: 0, ammo: 130, color: "#7ad7ff" },
  rocket: { label: "火箭", cooldown: 430, speed: 10, damage: 42, count: 1, spread: 0, ammo: 30, color: "#ff8a47", explosive: true }
};

const input = { left: false, right: false, shoot: false };
const pressed = new Set();
let state = null;
let lastTime = performance.now();
let raf = 0;

function newRun(levelIndex = 0, checkpointX = 90) {
  const level = LEVELS[levelIndex];
  return {
    mode: "play",
    levelIndex,
    camera: 0,
    time: 0,
    score: 0,
    kills: 0,
    nextSpawn: 700,
    checkpointX,
    bossSpawned: false,
    finished: false,
    player: {
      x: checkpointX,
      y: FLOOR - 76,
      w: 42,
      h: 76,
      vx: 0,
      vy: 0,
      facing: 1,
      hp: 100,
      lives: 3,
      grenades: 4,
      onGround: true,
      groundY: FLOOR,
      invuln: 1600,
      weapon: "rifle",
      ammo: Infinity,
      lastShot: 0,
      lastHurt: 0
    },
    bullets: [],
    enemyBullets: [],
    grenades: [],
    enemies: level.enemies.map((e) => makeEnemy(e.type, e.x)),
    pickups: level.pickups.map((p) => makePickup(p.type, p.x)),
    effects: []
  };
}

function makeEnemy(type, x) {
  const stats = {
    runner: { hp: 28, speed: 1.8, range: 80, color: "#ffcf5a" },
    rifle: { hp: 42, speed: 0.7, range: 420, color: "#f05d4f" },
    shield: { hp: 72, speed: 0.45, range: 320, color: "#93a1ad" },
    turret: { hp: 90, speed: 0, range: 560, color: "#ff8a47", boss: true },
    walker: { hp: 120, speed: 0.55, range: 540, color: "#b3e56d", boss: true },
    cannon: { hp: 150, speed: 0.4, range: 590, color: "#ff9d66", boss: true },
    bunker: { hp: 180, speed: 0.25, range: 620, color: "#a8d8ff", boss: true },
    core: { hp: 240, speed: 0.35, range: 660, color: "#d388ff", boss: true }
  }[type];
  return {
    type,
    x,
    y: FLOOR - (stats.boss ? 112 : 62),
    w: stats.boss ? 94 : 42,
    h: stats.boss ? 112 : 62,
    vx: 0,
    hp: stats.hp,
    maxHp: stats.hp,
    speed: stats.speed,
    range: stats.range,
    color: stats.color,
    boss: Boolean(stats.boss),
    lastShot: 0,
    hurtFlash: 0,
    vy: 0,
    onGround: true,
    groundY: FLOOR,
    nextJump: 500 + Math.random() * 1200,
    dodgeUntil: 0,
    patrol: Math.random() > 0.5 ? 1 : -1
  };
}

function makePickup(type, x) {
  return { type, x, y: FLOOR - 94, w: 34, h: 34, taken: false, bob: Math.random() * 8 };
}

function startGame(load = false) {
  const save = load ? loadSave() : null;
  if (save) {
    state = newRun(save.levelIndex, save.checkpointX);
    state.score = save.score || 0;
    state.player.lives = save.lives || 3;
    state.player.grenades = save.grenades || 4;
    state.player.weapon = save.weapon || "rifle";
    state.player.ammo = Number.isFinite(save.ammo) ? save.ammo : Infinity;
  } else {
    state = newRun();
  }
  ui.overlay.classList.add("hidden");
  lastTime = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
}

function saveGame() {
  if (!state) return;
  const data = {
    levelIndex: state.levelIndex,
    checkpointX: state.checkpointX,
    score: state.score,
    lives: state.player.lives,
    grenades: state.player.grenades,
    weapon: state.player.weapon,
    ammo: Number.isFinite(state.player.ammo) ? state.player.ammo : null,
    savedAt: Date.now()
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  toast("已存檔到目前復活點");
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loop(now) {
  const dt = Math.min(34, now - lastTime);
  lastTime = now;
  update(dt);
  draw();
  raf = requestAnimationFrame(loop);
}

function update(dt) {
  if (!state || state.mode !== "play") return;
  state.time += dt;
  const level = LEVELS[state.levelIndex];
  const p = state.player;
  p.invuln = Math.max(0, p.invuln - dt);

  p.vx = 0;
  if (input.left) {
    p.vx = -4.3;
    p.facing = -1;
  }
  if (input.right) {
    p.vx = 4.3;
    p.facing = 1;
  }
  if (pressed.has("jump") && p.onGround) {
    p.vy = -17;
    p.onGround = false;
  }
  pressed.delete("jump");

  p.vy += GRAVITY;
  p.x = clamp(p.x + p.vx, 20, level.length - 90);
  moveWithPlatforms(p, level);

  for (const cp of level.checkpoints) {
    if (p.x > cp && cp > state.checkpointX) {
      state.checkpointX = cp;
      toast("復活點已更新");
      saveGame();
    }
  }

  if (input.shoot) shoot();
  if (pressed.has("grenade")) throwGrenade();
  pressed.delete("grenade");

  state.camera = clamp(p.x - 340, 0, Math.max(0, level.length - WIDTH));
  spawnEnemies(level);
  spawnBoss(level);
  updateBullets(dt);
  updateEnemies(dt);
  updatePickups();
  updateEffects(dt);
  updateUi();
}

function shoot() {
  const p = state.player;
  const weapon = WEAPONS[p.weapon];
  if (state.time - p.lastShot < weapon.cooldown) return;
  if (Number.isFinite(p.ammo) && p.ammo <= 0) {
    p.weapon = "rifle";
    p.ammo = Infinity;
    return;
  }
  p.lastShot = state.time;
  if (Number.isFinite(p.ammo)) p.ammo -= 1;
  const centerY = p.y + 31;
  for (let i = 0; i < weapon.count; i++) {
    const offset = i - (weapon.count - 1) / 2;
    state.bullets.push({
      x: p.x + (p.facing > 0 ? p.w + 4 : -8),
      y: centerY,
      vx: weapon.speed * p.facing,
      vy: offset * weapon.spread * weapon.speed,
      r: weapon.explosive ? 8 : 4,
      damage: weapon.damage,
      color: weapon.color,
      explosive: weapon.explosive,
      life: 900
    });
  }
}

function throwGrenade() {
  const p = state.player;
  if (p.grenades <= 0) return;
  p.grenades -= 1;
  state.grenades.push({
    x: p.x + p.w / 2,
    y: p.y + 18,
    vx: 8 * p.facing,
    vy: -11,
    fuse: 720
  });
}

function moveWithPlatforms(actor, level) {
  const previousBottom = actor.y + actor.h;
  actor.y += actor.vy;
  actor.onGround = false;
  actor.groundY = FLOOR;

  if (actor.vy >= 0) {
    for (const platform of level.platforms || []) {
      const actorRight = actor.x + actor.w;
      const actorLeft = actor.x;
      const withinX = actorRight > platform.x + 8 && actorLeft < platform.x + platform.w - 8;
      const crossedTop = previousBottom <= platform.y + 8 && actor.y + actor.h >= platform.y;
      if (withinX && crossedTop) {
        actor.y = platform.y - actor.h;
        actor.vy = 0;
        actor.onGround = true;
        actor.groundY = platform.y;
        return;
      }
    }
  }

  if (actor.y + actor.h >= FLOOR) {
    actor.y = FLOOR - actor.h;
    actor.vy = 0;
    actor.onGround = true;
    actor.groundY = FLOOR;
  }
}

function spawnEnemies(level) {
  if (state.enemies.length >= level.enemyCap || state.time < state.nextSpawn) return;
  const ahead = state.camera + WIDTH + 80;
  if (ahead > level.length - 280) return;
  const types = state.levelIndex > 2 ? ["rifle", "runner", "shield"] : ["rifle", "runner"];
  const type = types[Math.floor(Math.random() * types.length)];
  state.enemies.push(makeEnemy(type, ahead + Math.random() * 220));
  state.nextSpawn = state.time + level.spawnEvery;
}

function spawnBoss(level) {
  if (state.bossSpawned || state.player.x < level.boss.x - 520) return;
  state.enemies.push(makeEnemy(level.boss.type, level.boss.x));
  state.bossSpawned = true;
  toast("敵方重裝單位出現");
}

function updateBullets(dt) {
  const p = state.player;
  for (const b of state.bullets) {
    b.x += b.vx;
    b.y += b.vy;
    b.life -= dt;
    for (const e of state.enemies) {
      if (rectCircle(e, b) && e.hp > 0) {
        damageEnemy(e, b.damage);
        b.life = 0;
        if (b.explosive) explode(b.x, b.y, 82, 34);
        break;
      }
    }
  }
  for (const b of state.enemyBullets) {
    b.x += b.vx;
    b.y += b.vy;
    b.life -= dt;
    if (p.invuln <= 0 && rectCircle(p, b)) {
      hurtPlayer(b.damage);
      b.life = 0;
    }
  }
  for (const g of state.grenades) {
    g.x += g.vx;
    g.y += g.vy;
    g.vy += 0.55;
    if (g.y > FLOOR - 10) {
      g.y = FLOOR - 10;
      g.vy *= -0.35;
      g.vx *= 0.82;
    }
    g.fuse -= dt;
    if (g.fuse <= 0) {
      explode(g.x, g.y, 118, 62);
      g.dead = true;
    }
  }
  state.bullets = state.bullets.filter((b) => b.life > 0 && Math.abs(b.x - state.player.x) < 900);
  state.enemyBullets = state.enemyBullets.filter((b) => b.life > 0 && Math.abs(b.x - state.player.x) < 900);
  state.grenades = state.grenades.filter((g) => !g.dead);
}

function updateEnemies(dt) {
  const p = state.player;
  const level = LEVELS[state.levelIndex];
  for (const e of state.enemies) {
    if (Math.abs(e.x - p.x) > 900) continue;
    const dir = p.x > e.x ? 1 : -1;
    const dist = Math.abs(p.x - e.x);
    e.hurtFlash = Math.max(0, e.hurtFlash - dt);
    e.nextJump -= dt;
    e.dodgeUntil = Math.max(0, e.dodgeUntil - dt);

    if (e.type === "runner") {
      e.x += e.speed * (dist > 44 ? 1.45 : 0.3) * dir;
      if (e.onGround && e.nextJump <= 0 && (Math.abs(p.y - e.y) > 34 || dist < 180)) {
        e.vy = p.y + p.h < e.y ? -15.5 : -12.5;
        e.onGround = false;
        e.nextJump = 900 + Math.random() * 1050;
      }
    } else if (e.type === "rifle") {
      if (dist < 210) {
        e.x -= e.speed * 1.35 * dir;
      } else if (dist > e.range * 0.74) {
        e.x += e.speed * 1.15 * dir;
      } else {
        e.x += Math.sin(state.time / 260 + e.x) * 0.45;
      }
      if (e.onGround && e.nextJump <= 0 && Math.random() < 0.35) {
        e.vy = -12;
        e.onGround = false;
        e.nextJump = 1400 + Math.random() * 1300;
      }
    } else if (e.type === "shield") {
      e.x += e.speed * (dist > 70 ? 1.05 : -0.45) * dir;
      if (e.onGround && e.nextJump <= 0 && p.y + p.h < e.y + 10) {
        e.vy = -13.5;
        e.onGround = false;
        e.nextJump = 1600 + Math.random() * 1200;
      }
    } else if (e.boss) {
      e.x += e.speed * (dist > e.range * 0.5 ? 0.8 : -0.35) * dir;
      if (e.onGround && e.nextJump <= 0 && e.type !== "turret") {
        e.vy = -10;
        e.onGround = false;
        e.nextJump = 1800 + Math.random() * 1400;
      }
    } else if (dist > e.range * 0.55) {
      e.x += e.speed * dir;
    }

    e.x = clamp(e.x, 20, level.length - e.w - 30);
    e.vy += GRAVITY;
    moveWithPlatforms(e, level);

    for (const b of state.bullets) {
      const incoming = Math.abs(b.x - (e.x + e.w / 2)) < 130 && Math.sign(b.vx) === Math.sign(e.x - b.x);
      if (incoming && e.onGround && !e.boss && e.dodgeUntil <= 0) {
        e.vy = -11.5;
        e.onGround = false;
        e.dodgeUntil = 900;
        break;
      }
    }
    if (dist < e.range && state.time - e.lastShot > (e.boss ? 720 : 1150)) {
      e.lastShot = state.time;
      enemyShoot(e, dir);
    }
    if (p.invuln <= 0 && overlap(p, e)) {
      hurtPlayer(e.boss ? 28 : 18);
    }
  }
  state.enemies = state.enemies.filter((e) => e.hp > 0);
}

function enemyShoot(e, dir) {
  const shots = e.boss ? 3 : 1;
  for (let i = 0; i < shots; i++) {
    state.enemyBullets.push({
      x: e.x + e.w / 2,
      y: e.y + e.h * 0.42,
      vx: (e.boss ? 6 : 5) * dir,
      vy: (i - 1) * 1.4,
      r: e.boss ? 6 : 4,
      damage: e.boss ? 18 : 12,
      color: e.boss ? "#ff8a47" : "#f05d4f",
      life: 1500
    });
  }
}

function damageEnemy(e, amount) {
  e.hp -= amount;
  e.hurtFlash = 90;
  state.effects.push({ type: "hit", x: e.x + e.w / 2, y: e.y + e.h / 2, life: 180, max: 180 });
  if (e.hp <= 0) {
    state.score += e.boss ? 2000 : 150;
    state.kills += 1;
    explode(e.x + e.w / 2, e.y + e.h / 2, e.boss ? 120 : 58, e.boss ? 24 : 0, false);
    if (e.boss) completeLevel();
  }
}

function explode(x, y, radius, damage, harm = true) {
  state.effects.push({ type: "boom", x, y, r: radius, life: 330, max: 330 });
  if (harm) {
    for (const e of state.enemies) {
      const d = Math.hypot(e.x + e.w / 2 - x, e.y + e.h / 2 - y);
      if (d < radius) damageEnemy(e, damage);
    }
  }
}

function updatePickups() {
  const p = state.player;
  for (const item of state.pickups) {
    if (item.taken) continue;
    item.bob += 0.08;
    const box = { x: item.x, y: item.y + Math.sin(item.bob) * 7, w: item.w, h: item.h };
    if (overlap(p, box)) {
      item.taken = true;
      applyPickup(item.type);
    }
  }
}

function applyPickup(type) {
  const p = state.player;
  if (type === "heal") {
    p.hp = Math.min(100, p.hp + 45);
    toast("補血 +45");
    return;
  }
  if (type === "grenades") {
    p.grenades += 4;
    toast("榴彈補給");
    return;
  }
  p.weapon = type;
  p.ammo = WEAPONS[type].ammo;
  toast(`武器升級：${WEAPONS[type].label}`);
}

function hurtPlayer(amount) {
  const p = state.player;
  if (state.time - p.lastHurt < 900) return;
  p.lastHurt = state.time;
  p.hp -= amount;
  p.invuln = 850;
  state.effects.push({ type: "hit", x: p.x + p.w / 2, y: p.y + p.h / 2, life: 230, max: 230 });
  if (p.hp <= 0) respawn();
}

function respawn() {
  const p = state.player;
  p.lives -= 1;
  if (p.lives < 0) {
    gameOver();
    return;
  }
  p.hp = 100;
  p.x = state.checkpointX;
  p.y = FLOOR - p.h;
  p.vx = 0;
  p.vy = 0;
  p.invuln = 2200;
  p.weapon = "rifle";
  p.ammo = Infinity;
  state.enemyBullets = [];
  state.grenades = [];
  toast("從復活點繼續");
}

function completeLevel() {
  if (state.finished) return;
  state.finished = true;
  state.score += 1000 + state.player.lives * 250;
  if (state.levelIndex >= LEVELS.length - 1) {
    const finalScore = state.score;
    localStorage.removeItem(SAVE_KEY);
    state = newRun();
    showOverlay("任務完成", `你突破 5 關，總分 ${finalScore}。按開始可重新挑戰。`);
    return;
  }
  const next = state.levelIndex + 1;
  const score = state.score;
  const lives = Math.min(5, state.player.lives + 1);
  const grenades = Math.min(8, state.player.grenades + 2);
  state = newRun(next, 90);
  state.score = score;
  state.player.lives = lives;
  state.player.grenades = grenades;
  saveGame();
  showOverlay("關卡突破", `下一關：${LEVELS[next].name}。已自動存檔。`);
}

function gameOver() {
  const finalScore = state.score;
  localStorage.removeItem(SAVE_KEY);
  state = newRun();
  showOverlay("任務失敗", `分數 ${finalScore}。可重新開始，或讀取較早存檔。`);
}

function showOverlay(title, text) {
  ui.overlayTitle.textContent = title;
  ui.overlayText.textContent = text;
  ui.overlay.classList.remove("hidden");
  if (state) state.mode = "pause";
}

function pauseGame() {
  if (!state) return;
  if (ui.overlay.classList.contains("hidden")) {
    showOverlay("暫停", "可存檔、重開，或按開始繼續。");
  } else {
    ui.overlay.classList.add("hidden");
    state.mode = "play";
    lastTime = performance.now();
  }
}

function toast(text) {
  if (!state) return;
  state.effects.push({ type: "toast", text, x: state.player.x, y: state.player.y - 48, life: 1250, max: 1250 });
}

function updateEffects(dt) {
  for (const fx of state.effects) fx.life -= dt;
  state.effects = state.effects.filter((fx) => fx.life > 0);
}

function updateUi() {
  if (!state) return;
  const p = state.player;
  ui.level.textContent = `${state.levelIndex + 1}-5 ${LEVELS[state.levelIndex].name}`;
  ui.lives.textContent = `${p.lives} / HP ${Math.max(0, Math.ceil(p.hp))}`;
  ui.weapon.textContent = `${WEAPONS[p.weapon].label}${Number.isFinite(p.ammo) ? ` ${p.ammo}` : ""}`;
  ui.score.textContent = state.score.toString();
}

function draw() {
  if (!state) {
    drawAttract();
    return;
  }
  const level = LEVELS[state.levelIndex];
  const cam = state.camera;
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, level.sky[0]);
  gradient.addColorStop(1, level.sky[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  drawBackground(level, cam);
  drawPickups(cam);
  drawPlayer(cam);
  drawEnemies(cam);
  drawProjectiles(cam);
  drawEffects(cam);
  drawForeground(level, cam);
}

function drawAttract() {
  ctx.fillStyle = "#121820";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#2f3742";
  ctx.fillRect(0, FLOOR, WIDTH, HEIGHT - FLOOR);
}

function drawBackground(level, cam) {
  ctx.save();
  for (let i = -1; i < 12; i++) {
    const x = i * 190 - (cam * 0.18) % 190;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(x, 160 + (i % 3) * 38, 92, 260);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(x + 16, 205, 12, 160);
    ctx.fillRect(x + 52, 185, 12, 190);
  }
  for (const cp of level.checkpoints) {
    const x = cp - cam;
    if (x < -40 || x > WIDTH + 40) continue;
    ctx.fillStyle = "#56d68a";
    ctx.fillRect(x, FLOOR - 118, 10, 118);
    ctx.fillStyle = "#f4efe6";
    ctx.fillRect(x + 10, FLOOR - 118, 46, 26);
  }
  ctx.restore();
}

function drawForeground(level, cam) {
  for (const platform of level.platforms || []) {
    const x = platform.x - cam;
    if (x < -platform.w || x > WIDTH + 40) continue;
    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(x + 6, platform.y + 8, platform.w, platform.h);
    ctx.fillStyle = "#d8b45b";
    ctx.fillRect(x, platform.y, platform.w, platform.h);
    ctx.fillStyle = "#725632";
    ctx.fillRect(x + 8, platform.y + platform.h - 5, platform.w - 16, 5);
  }
  ctx.fillStyle = level.ground;
  ctx.fillRect(0, FLOOR, WIDTH, HEIGHT - FLOOR);
  ctx.fillStyle = "rgba(0,0,0,0.24)";
  for (let i = -1; i < 18; i++) {
    const x = i * 96 - (cam % 96);
    ctx.fillRect(x, FLOOR + 26, 70, 10);
    ctx.fillRect(x + 20, FLOOR + 58, 92, 8);
  }
  ctx.fillStyle = "#d2c39f";
  ctx.fillRect(0, FLOOR, WIDTH, 6);
  const progress = clamp(state.player.x / level.length, 0, 1);
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(24, HEIGHT - 26, 220, 8);
  ctx.fillStyle = "#56d68a";
  ctx.fillRect(24, HEIGHT - 26, 220 * progress, 8);
}

function drawPlayer(cam) {
  const p = state.player;
  const x = p.x - cam;
  ctx.save();
  ctx.globalAlpha = p.invuln > 0 && Math.floor(state.time / 90) % 2 === 0 ? 0.45 : 1;
  ctx.fillStyle = "#234b74";
  ctx.fillRect(x + 8, p.y + 24, 28, 38);
  ctx.fillStyle = "#f0c08d";
  ctx.fillRect(x + 10, p.y + 2, 24, 24);
  ctx.fillStyle = "#2b2d31";
  ctx.fillRect(x + 6, p.y - 4, 32, 10);
  ctx.fillStyle = "#1d2026";
  ctx.fillRect(x + (p.facing > 0 ? 32 : -18), p.y + 31, 28, 8);
  ctx.fillStyle = "#23313b";
  ctx.fillRect(x + 9, p.y + 62, 10, 14);
  ctx.fillRect(x + 26, p.y + 62, 10, 14);
  ctx.restore();

  drawBar(x - 4, p.y - 16, 50, 6, p.hp / 100, "#56d68a");
}

function drawEnemies(cam) {
  for (const e of state.enemies) {
    const x = e.x - cam;
    if (x < -140 || x > WIDTH + 140) continue;
    ctx.fillStyle = e.hurtFlash > 0 ? "#fff7e0" : e.color;
    ctx.fillRect(x, e.y + 10, e.w, e.h - 10);
    ctx.fillStyle = "#1d2026";
    ctx.fillRect(x + e.w * 0.18, e.y, e.w * 0.64, 18);
    if (e.type === "shield") {
      ctx.fillStyle = "rgba(230,240,255,0.55)";
      ctx.fillRect(x - 8, e.y + 8, 12, e.h - 8);
    }
    if (e.boss) {
      ctx.fillStyle = "#1d2026";
      ctx.fillRect(x - 18, e.y + 40, 34, 12);
      ctx.fillRect(x + e.w - 8, e.y + 30, 44, 14);
    }
    drawBar(x, e.y - 12, e.w, 6, e.hp / e.maxHp, e.boss ? "#f05d4f" : "#e9b949");
  }
}

function drawPickups(cam) {
  for (const item of state.pickups) {
    if (item.taken) continue;
    const x = item.x - cam;
    if (x < -50 || x > WIDTH + 50) continue;
    const y = item.y + Math.sin(item.bob) * 7;
    const colors = { spread: "#f2c94c", laser: "#7ad7ff", rocket: "#ff8a47", heal: "#56d68a", grenades: "#c49bff" };
    ctx.fillStyle = colors[item.type];
    ctx.fillRect(x, y, item.w, item.h);
    ctx.fillStyle = "#1a1814";
    ctx.font = "700 18px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(item.type === "heal" ? "+" : item.type[0].toUpperCase(), x + item.w / 2, y + 23);
  }
}

function drawProjectiles(cam) {
  for (const b of [...state.bullets, ...state.enemyBullets]) {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x - cam, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const g of state.grenades) {
    ctx.fillStyle = "#28313a";
    ctx.beginPath();
    ctx.arc(g.x - cam, g.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f2c94c";
    ctx.fillRect(g.x - cam - 2, g.y - 12, 4, 6);
  }
}

function drawEffects(cam) {
  ctx.save();
  for (const fx of state.effects) {
    const alpha = clamp(fx.life / fx.max, 0, 1);
    if (fx.type === "boom") {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#ffcf5a";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(fx.x - cam, fx.y, fx.r * (1 - alpha), 0, Math.PI * 2);
      ctx.stroke();
    } else if (fx.type === "hit") {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#fff7e0";
      ctx.fillRect(fx.x - cam - 12, fx.y - 12, 24, 24);
    } else if (fx.type === "toast") {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#f4efe6";
      ctx.font = "800 24px 'Microsoft JhengHei', system-ui";
      ctx.textAlign = "center";
      ctx.fillText(fx.text, fx.x - cam, fx.y - (1 - alpha) * 24);
    }
  }
  ctx.restore();
}

function drawBar(x, y, w, h, value, color) {
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * clamp(value, 0, 1), h);
}

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function rectCircle(rect, c) {
  const cx = clamp(c.x, rect.x, rect.x + rect.w);
  const cy = clamp(c.y, rect.y, rect.y + rect.h);
  return Math.hypot(c.x - cx, c.y - cy) <= c.r;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function bindControls() {
  let lastTouchEnd = 0;
  const stopBrowserGesture = (event) => event.preventDefault();

  ["gesturestart", "gesturechange", "gestureend"].forEach((name) => {
    document.addEventListener(name, stopBrowserGesture, { passive: false });
  });

  document.addEventListener("dblclick", (event) => {
    event.preventDefault();
  }, { passive: false });

  document.addEventListener("touchend", (event) => {
    const now = Date.now();
    if (now - lastTouchEnd < 360) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  document.addEventListener("touchmove", (event) => {
    event.preventDefault();
  }, { passive: false });

  window.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    if (event.code === "KeyA" || event.code === "ArrowLeft") input.left = true;
    if (event.code === "KeyD" || event.code === "ArrowRight") input.right = true;
    if (event.code === "KeyJ") input.shoot = true;
    if (event.code === "KeyW" || event.code === "Space" || event.code === "ArrowUp") pressed.add("jump");
    if (event.code === "KeyK") pressed.add("grenade");
    if (event.code === "KeyP") pauseGame();
  });
  window.addEventListener("keyup", (event) => {
    if (event.code === "KeyA" || event.code === "ArrowLeft") input.left = false;
    if (event.code === "KeyD" || event.code === "ArrowRight") input.right = false;
    if (event.code === "KeyJ") input.shoot = false;
  });
  document.querySelectorAll("[data-hold]").forEach((button) => {
    const key = button.dataset.hold;
    const on = (event) => {
      event.preventDefault();
      input[key] = true;
    };
    const off = (event) => {
      event.preventDefault();
      input[key] = false;
    };
    button.addEventListener("pointerdown", on);
    button.addEventListener("pointerup", off);
    button.addEventListener("pointercancel", off);
    button.addEventListener("pointerleave", off);
  });
  document.querySelectorAll("[data-press]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      pressed.add(button.dataset.press);
    });
  });
}

ui.startBtn.addEventListener("click", () => {
  if (state && state.mode === "pause") {
    state.mode = "play";
    ui.overlay.classList.add("hidden");
    lastTime = performance.now();
  } else {
    startGame(false);
  }
});
ui.loadBtn.addEventListener("click", () => startGame(true));
ui.pauseBtn.addEventListener("click", pauseGame);
ui.saveBtn.addEventListener("click", saveGame);
ui.resetBtn.addEventListener("click", () => {
  localStorage.removeItem(SAVE_KEY);
  state = newRun();
  showOverlay("重新開始", "存檔已清除，按開始遊戲重新挑戰。");
});

bindControls();
state = newRun();
updateUi();
draw();
