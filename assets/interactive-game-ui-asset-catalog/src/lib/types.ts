import type { ComponentType } from 'react';

export type CategoryId = 'controls' | 'navigation' | 'hud' | 'economy' | 'menus' | 'world';

export interface Category {
  id: CategoryId;
  index: string;
  label: string;
  title: string;
  desc: string;
  color: string;
}

export type Tier = 'S' | 'A' | 'B';

export interface AssetDef {
  id: string;
  name: string;
  title: string;
  desc: string;
  category: CategoryId;
  tier: Tier;
  source: 'CORE' | 'EXT';
  hint: string;
  tags: string[];
  Demo: ComponentType;
}
