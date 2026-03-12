import type {
  AlbumCardItem,
  CardDetailVariant,
} from '../types/card';
import { buildPlaceholderCover } from '../utils/image';

const stylePattern = ['rose', 'violet', 'pearl', 'violet', 'rose', 'pearl'] as const;
const detailPattern: CardDetailVariant[] = ['letter', 'split', 'note', 'collage'];

const cardCount = 52;

export const cards: AlbumCardItem[] = Array.from({ length: cardCount }, (_, index) => {
  const cardNumber = index + 1;

  return {
    id: `card-${String(cardNumber).padStart(2, '0')}`,
    title: `Moment ${String(cardNumber).padStart(2, '0')}`,
    image: buildPlaceholderCover(
      cardNumber,
      stylePattern[index % stylePattern.length],
    ),
    lyrics: [
      `Lyric placeholder line ${String((index % 3) + 1)}.`,
      'Soft copy can be replaced later.',
      'Detail content remains config-driven.',
    ],
    note: 'Replace with custom note, lyric fragment, or short message later.',
    sizeType: 'medium',
    interactive: true,
    depthGroup: 'foreground',
    rotation: 0,
    x: 50,
    y: 50,
    z: 0,
    styleVariant: stylePattern[index % stylePattern.length],
    detailVariant: detailPattern[index % detailPattern.length],
  };
});
