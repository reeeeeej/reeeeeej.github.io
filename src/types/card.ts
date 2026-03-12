export type CardSizeType = 'large' | 'medium' | 'small';
export type CardDepthGroup = 'foreground' | 'midground' | 'background';
export type CardDetailVariant = 'letter' | 'collage' | 'note' | 'split';

export interface AlbumCardItem {
  id: string;
  title?: string;
  image: string;
  lyrics: string[];
  note?: string;
  sizeType: CardSizeType;
  interactive: boolean;
  depthGroup: CardDepthGroup;
  rotation?: number;
  x?: number;
  y?: number;
  z?: number;
  styleVariant?: string;
  detailVariant?: CardDetailVariant;
}
