import { getRandomInt } from '~/utils/number-helpers';

export type AdFeedItem<T> =
  | { type: 'data'; data: T }
  | { type: 'ad'; data: { adunit: AdUnitType; height: number; width: number } };
export type AdFeed<T> = AdFeedItem<T>[];

type AdMatrix = {
  indices: number[];
  lastIndex: number;
};
const adMatrix: AdMatrix = {
  indices: [],
  lastIndex: 0,
};

export function createAdFeed<T>({
  data,
  interval,
  adsBlocked,
}: {
  data: T[];
  interval?: number[];
  adsBlocked?: boolean;
}): AdFeed<T> {
  if (adsBlocked || !interval) return data.map((data) => ({ type: 'data', data }));

  const [lower, upper] = interval;
  while (adMatrix.lastIndex < data.length) {
    const min = adMatrix.lastIndex + lower + 1;
    const max = adMatrix.lastIndex + upper;
    const index = getRandomInt(min, max);
    adMatrix.indices.push(index);
    adMatrix.lastIndex = index;
  }

  return data.reduce<AdFeed<T>>((acc, item, i) => {
    if (adMatrix.indices.includes(i)) {
      acc.push({ type: 'ad', data: { adunit: 'Dynamic_InContent', height: 250, width: 300 } });
    }
    acc.push({ type: 'data', data: item });
    return acc;
  }, []);
}

export type AdSizeType = keyof typeof sizes;
export type AdSizes<T extends AdSizeType> = (typeof sizes)[T];
const sizes = {
  hero: [
    [728, 90],
    [970, 90],
    [970, 250],
    [300, 250],
    [300, 100],
    [320, 50],
    [320, 100],
    [468, 60],
  ],
  inContent: [
    [300, 250],
    [336, 280],
  ],
  stickySidebar: [
    [300, 600],
    [160, 600],
    [120, 600],
  ],
} as const;

type AdUnits = typeof adunits;
export type AdUnitType = keyof typeof adunits;
export type AdUnitSizes<T extends AdUnitType> = AdSizes<AdUnits[T]>;
export type AdUnitSize<T extends AdUnitType> = AdUnitSizes<T>[number];
export type AdUnitBidSizes<T extends AdUnitType> = AdUnitSize<T> | AdUnitSize<T>[];
const adunits = {
  Leaderboard_A: 'hero',
  Leaderboard_B: 'hero',
  Leaderboard_C: 'hero',
  Sidebar_A: 'inContent',
  Sidebar_B: 'inContent',
  Dynamic_InContent: 'inContent',
  StickySidebar_A: 'stickySidebar',
  StickySidebar_B: 'stickySidebar',
} as const;
