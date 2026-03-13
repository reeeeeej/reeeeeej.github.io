import { useMemo } from 'react';
import type {
  AlbumCardItem,
  CardDepthGroup,
  CardSizeType,
} from '../types/card';

interface HeartDepthSlot {
  x: number;
  y: number;
  z: number;
  sizeType: CardSizeType;
  depthGroup: CardDepthGroup;
  rotation: number;
  twistFactor: number;
  pitchAngle: number;
  yawAngle: number;
}

export interface HeartLayoutCard extends AlbumCardItem {
  x: number;
  y: number;
  z: number;
  rotation: number;
  sizeType: CardSizeType;
  depthGroup: CardDepthGroup;
  twistFactor: number;
  pitchAngle: number;
  yawAngle: number;
}

interface OutlineBandConfig {
  depthGroup: CardDepthGroup;
  count: number;
  scale: number;
  baseZ: number;
  zShift: number;
  sizeMode: CardSizeType;
  rotationScale: number;
  phase: number;
}

const HEART_PARAM_START = 0.2;
const HEART_PARAM_END = Math.PI * 2 - 0.2;

function heartCurve(t: number) {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return { x, y };
}

function normalizeHeartPoint(t: number) {
  const point = heartCurve(t);
  const normalized = {
    x: point.x / 17,
    y: point.y / 17,
  };
  const upper = Math.max(0, normalized.y);
  const lower = Math.max(0, -normalized.y);
  const lobeSpread = 1 + upper * 0.09 + Math.max(0, upper - 0.2) * 0.05;
  const tailTighten = 1 - lower * 0.08;

  return {
    x: normalized.x * lobeSpread * tailTighten,
    y:
      normalized.y >= 0
        ? normalized.y * 1.02 + 0.01
        : normalized.y * 0.86 + 0.03,
  };
}

function mapToViewport(point: { x: number; y: number }, scale: number) {
  return {
    x: 50 + point.x * 38.8 * scale,
    y: 45.8 - point.y * 31.4 * scale,
  };
}

function tValuesForCount(count: number, phase: number) {
  return Array.from({ length: count }, (_, index) => {
    const progress = count === 1 ? 0.5 : index / count;
    const eased = progress + Math.sin((progress + phase) * Math.PI * 2) * 0.008;

    return HEART_PARAM_START + eased * (HEART_PARAM_END - HEART_PARAM_START);
  });
}

function sizeForIndex(sizeMode: CardSizeType, index: number, count: number): CardSizeType {
  if (sizeMode === 'small') {
    return 'small';
  }

  const pivot = index / Math.max(1, count - 1);

  if (pivot > 0.88 || pivot < 0.08) {
    return 'small';
  }

  return 'medium';
}

function generateOutlineBand(config: OutlineBandConfig) {
  const tValues = tValuesForCount(config.count, config.phase);

  return tValues.map((t, index) => {
    const point = normalizeHeartPoint(t);
    const mapped = mapToViewport(point, config.scale);
    const xSign = point.x === 0 ? 0 : point.x > 0 ? 1 : -1;
    const lowerTail = Math.max(0, -point.y - 0.08);
    const upperLobe = Math.max(0, point.y - 0.2);
    const z =
      config.baseZ -
      lowerTail * 10 +
      upperLobe * 4 +
      Math.sin(t * 2.4 + config.phase) * config.zShift;

    return {
      x: mapped.x,
      y: mapped.y,
      z,
      sizeType: sizeForIndex(config.sizeMode, index, config.count),
      depthGroup: config.depthGroup,
      rotation: point.x * config.rotationScale + Math.sin(t * 3.4 + config.phase) * 1.1,
      twistFactor: point.x * 4.8,
      pitchAngle:
        -1.2 +
        lowerTail * 6 +
        upperLobe * -2.4 +
        Math.cos(t * 2.1 + config.phase) * 1.3,
      yawAngle: point.x * 7.8 + Math.sin(t * 2.8 + config.phase) * 1.8,
    } satisfies HeartDepthSlot;
  });
}

function computeBandCounts(totalCards: number) {
  const front = Math.max(16, Math.round(totalCards * 0.48));
  const mid = Math.max(8, Math.round(totalCards * 0.3));
  const back = Math.max(4, totalCards - front - mid);

  if (front + mid + back <= totalCards) {
    return [front, mid, back] as const;
  }

  let remaining = totalCards;
  const safeFront = Math.min(front, Math.max(remaining - 12, 0));
  remaining -= safeFront;
  const safeMid = Math.min(mid, Math.max(remaining - 4, 0));
  remaining -= safeMid;
  const safeBack = Math.max(remaining, 0);

  return [safeFront, safeMid, safeBack] as const;
}

function generateOutlineSlots(totalCards: number) {
  if (totalCards <= 30) {
    return generateOutlineBand({
      depthGroup: 'foreground',
      count: totalCards,
      scale: 1.08,
      baseZ: 8,
      zShift: 1,
      sizeMode: 'medium',
      rotationScale: 3.8,
      phase: 0.02,
    }).map((slot, index) => ({
      ...slot,
      z: slot.z + Math.sin(index * 0.85) * 1.1,
      depthGroup: 'foreground' as const,
      sizeType: 'medium' as const,
    }));
  }

  const [frontCount, midCount, backCount] = computeBandCounts(totalCards);
  const configs: OutlineBandConfig[] = [
    {
      depthGroup: 'foreground',
      count: frontCount,
      scale: 1.12,
      baseZ: 18,
      zShift: 1.9,
      sizeMode: 'medium',
      rotationScale: 4.8,
      phase: 0.015,
    },
    {
      depthGroup: 'midground',
      count: midCount,
      scale: 1.05,
      baseZ: -4,
      zShift: 1.3,
      sizeMode: 'medium',
      rotationScale: 3.4,
      phase: 0.28,
    },
    {
      depthGroup: 'background',
      count: backCount,
      scale: 0.97,
      baseZ: -12,
      zShift: 1,
      sizeMode: 'small',
      rotationScale: 2.8,
      phase: 0.56,
    },
  ];

  return configs.flatMap((config) => generateOutlineBand(config));
}

export function useHeartLayout3D(cards: AlbumCardItem[]): HeartLayoutCard[] {
  return useMemo(() => {
    const slots = generateOutlineSlots(cards.length);

    return cards.map((card, index) => {
      const slot = slots[index % slots.length];

      return {
        ...card,
        x: slot.x,
        y: slot.y,
        z: slot.z,
        rotation: slot.rotation,
        sizeType: slot.sizeType,
        depthGroup: slot.depthGroup,
        twistFactor: slot.twistFactor,
        pitchAngle: slot.pitchAngle,
        yawAngle: slot.yawAngle,
      };
    });
  }, [cards]);
}
