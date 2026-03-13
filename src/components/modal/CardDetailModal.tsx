import { useEffect } from 'react';
import type { AlbumCardItem } from '../../types/card';
import { IconButton } from '../ui/IconButton';
import { ModalBackdrop } from './ModalBackdrop';

interface CardDetailModalProps {
  card: AlbumCardItem | null;
  onClose: () => void;
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  useEffect(() => {
    if (!card) {
      return undefined;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [card, onClose]);

  if (!card) {
    return null;
  }

  return (
    <div
      className="card-detail-modal"
      role="dialog"
      aria-modal="true"
      aria-label={card.songTitle}
    >
      <ModalBackdrop onClick={onClose} />

      <div className="card-detail-modal__panel">
        <IconButton label="Close detail" onClick={onClose}>
          ×
        </IconButton>

        <div className="card-detail-modal__cover">
          <img
            src={card.coverImage}
            alt={card.songTitle}
            loading="eager"
            decoding="sync"
          />
        </div>

        <div className="card-detail-modal__body">
          <div className="card-detail-modal__lyrics" aria-label="Lyrics placeholder">
            {card.lyrics ? <p>{card.lyrics}</p> : null}
          </div>

          <div className="card-detail-modal__meta">
            {card.artistName ? (
              <p className="card-detail-modal__artist">{card.artistName}</p>
            ) : null}
            <p className="card-detail-modal__song-line">{`——《${card.songTitle}》`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
