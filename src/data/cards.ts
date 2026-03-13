import type { AlbumCardItem, CardDetailVariant } from '../types/card';

const detailPattern: CardDetailVariant[] = ['letter', 'split', 'note', 'collage'];

const imageModules = import.meta.glob('../../image/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const lyricModules = import.meta.glob('../../image/*.txt', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function titleFromPath(path: string) {
  const fileName = path.split('/').pop() ?? path;
  return decodeURIComponent(fileName).replace(/\.[^.]+$/, '');
}

function normalizeTitle(title: string) {
  return title
    .normalize('NFKC')
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('zh-Hans-CN');
}

function normalizeLyrics(content: string) {
  return content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line, index, lines) => line.length > 0 || (index > 0 && index < lines.length - 1))
    .join('\n')
    .trim();
}

const imageEntries = Object.entries(imageModules)
  .map(([path, coverImage]) => ({
    title: titleFromPath(path),
    coverImage,
  }))
  .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));

const lyricEntries = new Map(
  Object.entries(lyricModules).map(([path, content]) => [
    normalizeTitle(titleFromPath(path)),
    normalizeLyrics(content),
  ]),
);

export const cards: AlbumCardItem[] = imageEntries.map((entry, index) => ({
  id: `card-${String(index + 1).padStart(2, '0')}`,
  title: entry.title,
  image: entry.coverImage,
  coverImage: entry.coverImage,
  songTitle: entry.title,
  artistName: '',
  lyrics: lyricEntries.get(normalizeTitle(entry.title)) ?? '',
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
