import type { ComponentType } from "react";
import { JoystickDemo, ChargeDemo, LanesDemo, DragDropDemo } from "./controls";
import { HealthDemo, CooldownDemo, DamageDemo, ComboDemo, RadarDemo, FeedDemo } from "./hud";
import { CarouselDemo, RadialDemo, BottomNavDemo } from "./navigation";
import { RarityDemo, TreeDemo, UpgradeDemo, ChestDemo, WheelDemo } from "./meta";
import { ShakeDemo, ImpactDemo, ToastsDemo, CoinsDemo } from "./feedback";
import { WipeDemo, IrisDemo, MorphDemo, LoadingDemo } from "./transitions";
import { MatchDemo, RespawnDemo } from "./session";
import { PassDemo, DailyDemo, BoardDemo, QuestDemo } from "./progression";
import { CoachDemo, TutorialDemo, PermissionDemo } from "./onboarding";
import { StoreDemo, CurrencyDemo, PurchaseDemo } from "./economy";

export const REGISTRY: Record<string, ComponentType> = {
  joystick: JoystickDemo,
  charge: ChargeDemo,
  lanes: LanesDemo,
  dragdrop: DragDropDemo,
  health: HealthDemo,
  cooldown: CooldownDemo,
  damage: DamageDemo,
  combo: ComboDemo,
  radar: RadarDemo,
  feed: FeedDemo,
  carousel: CarouselDemo,
  radial: RadialDemo,
  bottomnav: BottomNavDemo,
  rarity: RarityDemo,
  tree: TreeDemo,
  upgrade: UpgradeDemo,
  chest: ChestDemo,
  wheel: WheelDemo,
  shake: ShakeDemo,
  impact: ImpactDemo,
  toasts: ToastsDemo,
  coins: CoinsDemo,
  wipe: WipeDemo,
  iris: IrisDemo,
  morph: MorphDemo,
  loading: LoadingDemo,
  match: MatchDemo,
  respawn: RespawnDemo,
  pass: PassDemo,
  daily: DailyDemo,
  board: BoardDemo,
  quest: QuestDemo,
  coach: CoachDemo,
  tutorial: TutorialDemo,
  permission: PermissionDemo,
  store: StoreDemo,
  currency: CurrencyDemo,
  purchase: PurchaseDemo,
};
