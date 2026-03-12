import type { AlbumCardItem, CardDetailVariant } from '../../types/card';
import { IconButton } from '../ui/IconButton';
import { ModalBackdrop } from './ModalBackdrop';

interface CardDetailModalProps {
  card: AlbumCardItem | null;
  onClose: () => void;
}

const detailVariantCopy: Record<
  CardDetailVariant,
  {
    eyebrow: string;
    accentLabel: string;
    accentFallback: string;
    lead: string;
    seal: string;
  }
> = {
  letter: {
    eyebrow: 'Little Letter',
    accentLabel: 'Fold',
    accentFallback: 'Add a handwritten-style note here later.',
    lead: 'A softer memory panel for lyrics, little confessions, or private lines.',
    seal: 'Letter',
  },
  split: {
    eyebrow: 'Side Note',
    accentLabel: 'Margin',
    accentFallback: 'Use this side panel for short annotations or a date.',
    lead: 'A photo-led layout with a quieter note panel arranged beside it.',
    seal: 'Split',
  },
  collage: {
    eyebrow: 'Memory Sheet',
    accentLabel: 'Cutout',
    accentFallback: 'This block can hold collage captions or short scene fragments.',
    lead: 'A more editorial arrangement for layered notes and album-cover captions.',
    seal: 'Collage',
  },
  note: {
    eyebrow: 'Soft Note',
    accentLabel: 'Whisper',
    accentFallback: 'Use this floating memo for one short line that matters.',
    lead: 'A gentler card with the note drifting around the enlarged memory.',
    seal: 'Note',
  },
};

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  if (!card) {
    return null;
  }

  const detailVariant = card.detailVariant ?? 'letter';
  const variantCopy = detailVariantCopy[detailVariant];
  const title = card.title ?? 'Memory Card';
  const accentNote = card.note || variantCopy.accentFallback;

  return (
    <div className="card-detail-modal" role="dialog" aria-modal="true">
      <ModalBackdrop onClick={onClose} />

      <div
        className={`card-detail-modal__panel card-detail-modal__panel--${detailVariant}`}
      >
        <IconButton label="Close detail" onClick={onClose}>
          x
        </IconButton>

        <div className="card-detail-modal__seal" aria-hidden="true">
          {variantCopy.seal}
        </div>

        <div className="card-detail-modal__art">
          <div className="card-detail-modal__cover">
            <img src={card.image} alt={title} loading="eager" />
          </div>

          <div className="card-detail-modal__paper card-detail-modal__paper--main">
            <p className="card-detail-modal__eyebrow">{variantCopy.eyebrow}</p>
            <h3>{title}</h3>
            <p className="card-detail-modal__lead">{variantCopy.lead}</p>
            <div className="card-detail-modal__lyrics">
              {card.lyrics.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="card-detail-modal__paper card-detail-modal__paper--accent">
            <p className="card-detail-modal__note-label">{variantCopy.accentLabel}</p>
            <p className="card-detail-modal__note">{accentNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
