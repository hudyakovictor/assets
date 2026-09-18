import type { AssetDef, Category } from '../lib/types';
import { DemoJoystick, DemoAbilities, DemoCharge, DemoDPad, DemoSwipe, DemoAim } from '../demos/controls';
import { DemoCarousel, DemoTransitions, DemoRadial, DemoStack, DemoTabs, DemoMenuList } from '../demos/navigation';
import { DemoVitality, DemoDamage, DemoCombo, DemoBoss, DemoRadar, DemoQuest } from '../demos/hud';
import { DemoCrate, DemoDaily, DemoPass, DemoToast, DemoMagnet, DemoSkill } from '../demos/economy';
import { DemoRoster, DemoMatchmaking, DemoPause, DemoSettings, DemoCoach } from '../demos/menus';
import { DemoParallax, DemoImpact, DemoRain, DemoEmber } from '../demos/worldfx';

export const CATEGORIES: Category[] = [
  {
    id: 'controls', index: '01', label: 'CONTROLS', title: 'Control Systems',
    desc: 'Touch-native input rigs: floating joysticks with vector readouts, ability clusters with radial cooldowns, charge cores, gesture blades and aim assist. The feel layer of every award-winning action game.',
    color: '#C8FF31',
  },
  {
    id: 'navigation', index: '02', label: 'NAVIGATION', title: 'Navigation & Flow',
    desc: 'How screens breathe and swap: 3D deck carousels, a five-mode transition engine, radial orbit menus, judging card stacks, directional tab bars and expanding menu lists. Motion is the map.',
    color: '#5BE7FF',
  },
  {
    id: 'hud', index: '03', label: 'HUD / COMBAT', title: 'HUD & Combat Feedback',
    desc: 'Read-under-fire information design: ghost-damage vitality bars, physics damage numbers, combo decay windows, phased boss plates, live radar and claimable contract panels. Every hit lands visually.',
    color: '#FF5B6E',
  },
  {
    id: 'economy', index: '04', label: 'ECONOMY', title: 'Economy & Progression',
    desc: 'The dopamine infrastructure: loot vault cracks with rarity rays, streak circuits, battle pass roads, queued achievement toasts, magnetic currency flight and constellation skill trees.',
    color: '#FFC24B',
  },
  {
    id: 'menus', index: '05', label: 'META', title: 'Menus & Meta Screens',
    desc: 'The loop outside the loop: cinematic roster select, matchmaking radar ritual, frosted stasis pause, spring-loaded settings rack and onboarding waypoint tours with spotlight cutouts.',
    color: '#8B7CFF',
  },
  {
    id: 'world', index: '06', label: 'WORLD FX', title: 'World & Camera FX',
    desc: 'Atmosphere as a system: five-plane parallax valleys, hitstop-and-shake impact frames with chroma ghosts, canvas weather synths and touch-reactive ambient particle fields.',
    color: '#7CFFB2',
  },
];

export const ASSETS: AssetDef[] = [
  /* ── 01 CONTROL SYSTEMS ── */
  {
    id: 'AF-01', name: 'DRIFT CORE', title: 'Floating Virtual Joystick', category: 'controls', tier: 'S', source: 'CORE',
    hint: 'DRAG ANYWHERE', tags: ['TOUCH INPUT', 'SPRING RETURN', 'VECTOR API'],
    desc: 'Spawns under the finger anywhere on screen, clamps to an 8-way gate, reports normalized vector / power / direction. Dead zone and glow scale with deflection.',
    Demo: DemoJoystick,
  },
  {
    id: 'AF-02', name: 'TRIO ARC', title: 'Ability Cluster + Radial Cooldowns', category: 'controls', tier: 'S', source: 'CORE',
    hint: 'TAP ABILITIES', tags: ['COOLDOWN SWEEP', 'CAST LOG', 'CLUSTER UX'],
    desc: 'Attack core plus three ability shells arranged for thumb reach. Conic cooldown sweeps, deny-shake on locked casts and an event feed for combat readability.',
    Demo: DemoAbilities,
  },
  {
    id: 'AF-03', name: 'OVERDRIVE', title: 'Hold-To-Charge Core', category: 'controls', tier: 'A', source: 'EXT',
    hint: 'HOLD & RELEASE', tags: ['PRESSURE INPUT', 'STATE TIERS', 'MAX SHAKE'],
    desc: 'Press-and-hold charge loop with thermal state tiers — warm, hot, max — escalating glow, tactile shake at full charge and payload damage scaled on release.',
    Demo: DemoCharge,
  },
  {
    id: 'AF-04', name: 'TACTILE CROSS', title: 'D-Pad + Live Arena Rig', category: 'controls', tier: 'A', source: 'EXT',
    hint: 'HOLD DIRECTIONS', tags: ['8-WAY INPUT', 'INPUT HISTORY', 'DEBUG ARENA'],
    desc: 'Crisp hardware-style directional pad driving a live arena probe in real time. Press states, glow feedback and a rolling input-history buffer for combo validation.',
    Demo: DemoDPad,
  },
  {
    id: 'AF-05', name: 'BLADE TRACE', title: 'Swipe Trail + Gesture Recognition', category: 'controls', tier: 'S', source: 'EXT',
    hint: 'DRAG TO SLASH', tags: ['TRAIL RENDERER', 'GESTURE PARSE', 'CRIT ZIGZAG'],
    desc: 'Fruit-ninja grade blade trail with luminous decay. The parser reads heading variance — straight cuts resolve as slashes, zigzags detonate as crits.',
    Demo: DemoSwipe,
  },
  {
    id: 'AF-06', name: 'LOCK-ON', title: 'Aim-Assist Reticle', category: 'controls', tier: 'A', source: 'EXT',
    hint: 'SWEEP TARGETS', tags: ['SOFT MAGNETISM', 'ACQUIRE METER', 'TARGET SNAP'],
    desc: 'Assistive targeting loop: the reticle magnetizes to drones inside the cone, fills an acquisition meter and snaps to a confirmed lock with collapsing brackets.',
    Demo: DemoAim,
  },

  /* ── 02 NAVIGATION & FLOW ── */
  {
    id: 'AF-07', name: 'COVER VAULT', title: '3D Deck Carousel', category: 'navigation', tier: 'S', source: 'CORE',
    hint: 'SWIPE / TAP ARROWS', tags: ['COVER FLOW', 'INFINITE WRAP', 'DEPTH SORT'],
    desc: 'The course cornerstone, rebuilt circular: drag-swiped deck with perspective tilt, depth dimming, velocity fling and synced metadata plate.',
    Demo: DemoCarousel,
  },
  {
    id: 'AF-08', name: 'CUT SUITE', title: 'Screen Transition Engine', category: 'navigation', tier: 'S', source: 'CORE',
    hint: 'FIRE TRANSITIONS', tags: ['WIPE / IRIS / BLINDS', 'PIXEL CUT', 'GLITCH CUT'],
    desc: 'Five signature scene cuts in one rig — wipe, iris, staggered blinds, pixel dissolve and RGB glitch. Two-phase cover/reveal choreography with mid-cut frame swap.',
    Demo: DemoTransitions,
  },
  {
    id: 'AF-09', name: 'ORBIT RING', title: 'Radial Spring Menu', category: 'navigation', tier: 'A', source: 'EXT',
    hint: 'TAP CORE', tags: ['RADIAL LAYOUT', 'STAGGER PHYSICS', 'BACKDROP FOCUS'],
    desc: 'Six action nodes burst into orbit with ordered spring stagger and unwind in reverse. One-thumb reach, zero target misses, instant context.',
    Demo: DemoRadial,
  },
  {
    id: 'AF-10', name: 'FATE DECK', title: 'Judgment Card Stack', category: 'navigation', tier: 'A', source: 'EXT',
    hint: 'DRAG CARD', tags: ['FLING PHYSICS', 'ROTATION COUPLING', 'ACCEPT / SKIP'],
    desc: 'Tinder-meets-questlog: drag rotation coupled to travel, judgement stamps that fade with intent, velocity flings and a deck that re-feeds itself.',
    Demo: DemoStack,
  },
  {
    id: 'AF-11', name: 'PIVOT BAR', title: 'Directional Tab Engine', category: 'navigation', tier: 'A', source: 'EXT',
    hint: 'SWITCH TABS', tags: ['SHARED PILL', 'DIRECTION-AWARE', 'STAGGERED ROWS'],
    desc: 'Segmented control with a shared-layout indicator pill. Panels exit against the travel direction while rows cascade in with metric bars already mid-motion.',
    Demo: DemoTabs,
  },
  {
    id: 'AF-12', name: 'LAUNCH LIST', title: 'Expanding Menu Navigator', category: 'navigation', tier: 'B', source: 'EXT',
    hint: 'HOVER / TAP ITEMS', tags: ['INLINE PREVIEW', 'INDEX RHYTHM', 'PARALLAX ART'],
    desc: 'Console-grade vertical menu where the focused item unfolds an inline preview strip with parallax art settle and description metadata.',
    Demo: DemoMenuList,
  },

  /* ── 03 HUD & COMBAT FEEDBACK ── */
  {
    id: 'AF-13', name: 'LIFEFORGE', title: 'Vitality HUD — Ghost Damage', category: 'hud', tier: 'S', source: 'CORE',
    hint: 'HIT / REPAIR / EMP', tags: ['DELAYED GHOST BAR', 'SHIELD LAYER', 'SEGMENTS'],
    desc: 'Fighting-game vitality stack: instant HP drop with a delayed ghost bar draining behind it, shield absorb layer, segment ticks and hit/heal flash states.',
    Demo: DemoVitality,
  },
  {
    id: 'AF-14', name: 'HITCALL', title: 'Damage Number Physics', category: 'hud', tier: 'S', source: 'CORE',
    hint: 'TAP TO STRIKE', tags: ['CRIT SLAM', 'SCATTER DRIFT', 'HEAL CHANNEL'],
    desc: 'Floating combat text done right: crits slam in oversized then settle, normals drift with rotational scatter, heals surface as a separate channel. Dummy bias included.',
    Demo: DemoDamage,
  },
  {
    id: 'AF-15', name: 'RAMPAGE', title: 'Combo Chain Meter', category: 'hud', tier: 'A', source: 'EXT',
    hint: 'TAP RAPIDLY', tags: ['DECAY WINDOW', 'TIER FLASH', 'BEST CHAIN'],
    desc: 'A 0.9-second decay window keeps the chain alive. Tiers escalate Chain → Frenzy → Rampage → Godlike with color shifts, burst shockwaves and score multipliers.',
    Demo: DemoCombo,
  },
  {
    id: 'AF-16', name: 'TITAN FRAME', title: 'Boss Plate + Phase Breaks', category: 'hud', tier: 'A', source: 'EXT',
    hint: 'DEAL DAMAGE', tags: ['PHASE BANNERS', 'ARMOR PLATES', 'ENGRAM FRAME'],
    desc: 'Ornate boss frame with threshold phases: plates crack and tumble off as milestones fall, phase banners interrupt, and the death state shatters into a banner.',
    Demo: DemoBoss,
  },
  {
    id: 'AF-17', name: 'PULSE MAP', title: 'Radar Minimap', category: 'hud', tier: 'B', source: 'EXT',
    hint: 'PULSE PING', tags: ['SWEEP SYNC', 'CONTACT FADE', 'SONIC PING'],
    desc: 'Rotating sweep with contacts that bloom exactly when the beam passes and decay behind it. Manual ping emits an expanding sonar ring for squad callouts.',
    Demo: DemoRadar,
  },
  {
    id: 'AF-18', name: 'CONTRACT PANEL', title: 'Quest Tracker + Claims', category: 'hud', tier: 'A', source: 'EXT',
    hint: 'CHECK SUBTASKS', tags: ['STRIKE ANIM', 'CLAIM FLOW', 'XP COUNTER'],
    desc: 'Tracked contracts with animated strike-through subtasks, progress hairlines, claimable states that burn out of the list and XP that feeds the level chip.',
    Demo: DemoQuest,
  },

  /* ── 04 ECONOMY & PROGRESSION ── */
  {
    id: 'AF-19', name: 'VAULT CRACKER', title: 'Loot Crate Reveal', category: 'economy', tier: 'S', source: 'EXT',
    hint: 'CRACK IT OPEN', tags: ['RARITY RAYS', 'SHINE SWEEP', 'WEIGHTED PULLS'],
    desc: 'Anticipation shake, lid pop, rotating god-rays and three weighted pulls that spring onto felt — legendary drops hijack the color grade and fire a banner.',
    Demo: DemoCrate,
  },
  {
    id: 'AF-20', name: 'STREAK ROW', title: 'Daily Login Circuit', category: 'economy', tier: 'A', source: 'EXT',
    hint: 'CLAIM TODAY', tags: ['STAMP IMPACT', 'CONFETTI BITS', 'STREAK FLAME'],
    desc: 'Seven-day circuit with claim stamping, confetti shrapnel and a mega-crown on day seven. The streak counter bumps with every pickup — loss aversion, visualized.',
    Demo: DemoDaily,
  },
  {
    id: 'AF-21', name: 'ASCENSION ROAD', title: 'Battle Pass Track', category: 'economy', tier: 'A', source: 'EXT',
    hint: 'EARN & CLAIM', tags: ['TIER NODES', 'PROGRESS FILL', 'CLAIM PULSE'],
    desc: 'Eight-tier season road with a gradient progress spine, alternating node rhythm, unlock pings and one-tap claims sealed with a mint check.',
    Demo: DemoPass,
  },
  {
    id: 'AF-22', name: 'LAUREL POP', title: 'Achievement Toast Queue', category: 'economy', tier: 'B', source: 'EXT',
    hint: 'SPAM THE BUTTON', tags: ['TOAST QUEUE', 'GOD-RAY ICON', 'AUTO-DISMISS'],
    desc: 'Slide-in laurels with rotating ray icons, progress fill and shine pass. Spammable — the queue stacks two deep and drains gracefully. Never blocks play.',
    Demo: DemoToast,
  },
  {
    id: 'AF-23', name: 'GOLD MAGNET', title: 'Currency Vacuum Flight', category: 'economy', tier: 'S', source: 'EXT',
    hint: 'TAP FIELD', tags: ['BURST THEN FLY', 'ARC PATHS', 'WALLET BUMP'],
    desc: 'Coins burst outward with scatter physics, hesitate a beat, then arc home to the wallet on eased flight paths. The counter bumps per coin — you feel every unit.',
    Demo: DemoMagnet,
  },
  {
    id: 'AF-24', name: 'ASTRA TREE', title: 'Skill Constellation', category: 'economy', tier: 'A', source: 'EXT',
    hint: 'TAP NODES', tags: ['LINE DRAW-IN', 'REQ GATES', 'POINT ECONOMY'],
    desc: 'A star-map talent web: prerequisite edges draw themselves in on unlock, available nodes pulse for attention, and respec refunds the full point economy.',
    Demo: DemoSkill,
  },

  /* ── 05 MENUS & META ── */
  {
    id: 'AF-25', name: 'ROSTER STAGE', title: 'Character Select', category: 'menus', tier: 'S', source: 'EXT',
    hint: 'SWAP UNITS', tags: ['DIRECTIONAL SWAP', 'STAT SPRINGS', 'LOCK-IN FLASH'],
    desc: 'Fighting-game roster stage: portraits swap with direction-aware slides, orbit rings keep idle life, stat bars re-spring per unit and lock-in seals with a slam.',
    Demo: DemoRoster,
  },
  {
    id: 'AF-26', name: 'LINK RADAR', title: 'Matchmaking Ritual', category: 'menus', tier: 'A', source: 'EXT',
    hint: 'FIND MATCH', tags: ['SEARCH RIPPLES', 'SLOT FILL', 'FOUND BURST'],
    desc: 'Queueing as theatre: sonar ripples, cycling telemetry readouts, lobby slots that pop onto the radar one by one and a found-burst that flips the palette.',
    Demo: DemoMatchmaking,
  },
  {
    id: 'AF-27', name: 'STASIS GLASS', title: 'Time-Freeze Pause Menu', category: 'menus', tier: 'A', source: 'EXT',
    hint: 'TAP PAUSE ICON', tags: ['FROSTED PANEL', 'DESAT WORLD', 'STAGGER EXIT'],
    desc: 'The world grayscales and freezes behind frosted glass while menu rows stagger in from the right. Resume reverses the choreography — time gives itself back.',
    Demo: DemoPause,
  },
  {
    id: 'AF-28', name: 'TUNER RACK', title: 'Settings Rack + Juicy Springs', category: 'menus', tier: 'B', source: 'CORE',
    hint: 'DRAG / TOGGLE', tags: ['SPRING KNOBS', 'NOTCH RAILS', 'SEGMENT PILL'],
    desc: 'Course sliders graduated: spring-loaded toggles, draggable notch rails with live value readouts and a segmented quality selector riding a shared pill.',
    Demo: DemoSettings,
  },
  {
    id: 'AF-29', name: 'WAYPOINT GUIDE', title: 'Onboarding Coach Tour', category: 'menus', tier: 'A', source: 'EXT',
    hint: 'START TOUR', tags: ['SPOTLIGHT CUTOUT', 'STEP DOTS', 'SKIP FLOWS'],
    desc: 'Four-step guided tour with an animated spotlight cutout travelling between hotspots, pulse markers, progress dots and a completion bounty.',
    Demo: DemoCoach,
  },

  /* ── 06 WORLD & CAMERA FX ── */
  {
    id: 'AF-31', name: 'DEPTH FIELD', title: 'Five-Plane Parallax Valley', category: 'world', tier: 'S', source: 'CORE',
    hint: 'MOVE POINTER', tags: ['LAYER INERTIA', 'SPRING FOLLOW', 'ATMOS FOG'],
    desc: 'The course parallax, extended to five inertial planes — stars, sun, ranges, treeline and drifting fog — each following the pointer through its own damped spring.',
    Demo: DemoParallax,
  },
  {
    id: 'AF-32', name: 'IMPACT FRAME', title: 'Hitstop + Camera Shake', category: 'world', tier: 'S', source: 'EXT',
    hint: 'STRIKE', tags: ['90MS HITSTOP', 'CHROMA GHOSTS', 'SPARK FAN'],
    desc: 'The juice recipe: white-frame hitstop, six-impulse camera shake, chromatic after-images on the victim, spark fan and a knockback that snaps back with overshoot.',
    Demo: DemoImpact,
  },
  {
    id: 'AF-33', name: 'MICROCLIMATE', title: 'Canvas Weather Synth', category: 'world', tier: 'A', source: 'EXT',
    hint: 'SWITCH MODES', tags: ['WIND SHEAR', 'SPLASH PHYSICS', 'LIGHTNING POLL'],
    desc: 'Procedural rain renderer with three regimes — drizzle, rain, storm — wind shear angles, ground splash ellipses and randomized forked lightning strikes.',
    Demo: DemoRain,
  },
  {
    id: 'AF-34', name: 'EMBER DRIFT', title: 'Touch-Reactive Ambient Field', category: 'world', tier: 'B', source: 'EXT',
    hint: 'DISTURB FIELD', tags: ['ADDITIVE GLOW', 'POINTER REPEL', '3 PRESETS'],
    desc: 'Ambient particle ecology in three biomes — rising embers, pulsing fireflies, settling snow — additive-blended and parted around the player\'s touch.',
    Demo: DemoEmber,
  },
];
