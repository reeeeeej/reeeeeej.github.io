import type { AlbumCardItem, CardDetailVariant } from '../types/card';

const detailPattern: CardDetailVariant[] = ['letter', 'split', 'note', 'collage'];

const imageModules = import.meta.glob('../../image/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function titleFromPath(path: string) {
  const fileName = path.split('/').pop() ?? path;
  return decodeURIComponent(fileName).replace(/\.[^.]+$/, '');
}

const imageEntries = Object.entries(imageModules)
  .map(([path, coverImage]) => ({
    title: titleFromPath(path),
    coverImage,
  }))
  .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));

export const cards: AlbumCardItem[] = imageEntries.map((entry, index) => ({
  id: `card-${String(index + 1).padStart(2, '0')}`,
  title: entry.title,
  image: entry.coverImage,
  coverImage: entry.coverImage,
  songTitle: entry.title,
  artistName: '',
  lyrics: '',
  note: '',
  sizeType: 'medium',
  interactive: true,
  depthGroup: 'foreground',
  rotation: 0,
  x: 50,
  y: 50,
  z: 0,
  styleVariant: 'pearl',
  detailVariant: detailPattern[index % detailPattern.length],
}));
