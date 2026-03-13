import { useEffect } from 'react';
import type { AlbumCardItem } from '../../types/card';
import { IconButton } from '../ui/IconButton';
import { ModalBackdrop } from './ModalBackdrop';

interface CardDetailModalProps {
  card: AlbumCardItem | null;
  onClose: () => void;
}

function visibleLength(value: string) {
  return Array.from(value).reduce((total, char) => {
    if (/[\u4e00-\u9fff]/.test(char)) {
      return total + 2;
    }

    if (/\s/.test(char)) {
      return total + 0.4;
    }

    return total + 1;
  }, 0);
}

function normalizeLyricLines(lyrics: string) {
  const lines = lyrics
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return lines;
  }

  const lastLine = lines[lines.length - 1];
  const lastLength = visibleLength(lastLine);

  if (lines.length >= 3 && lastLength <= 3.2) {
    const previousLine = lines[lines.length - 2];
    return [...lines.slice(0, -2), `${previousLine} ${lastLine}`];
  }

  return lines;
}

function isLatinLine(value: string) {
  return /[A-Za-z]/.test(value) && !/[\u4e00-\u9fff]/.test(value);
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

  const lyricLines = normalizeLyricLines(card.lyrics);
  const lineCount = lyricLines.length;
  const lengths = lyricLines.map((line) => visibleLength(line));
  const maxLength = lengths.length > 0 ? Math.max(...lengths) : 0;
  const minLength = lengths.length > 0 ? Math.min(...lengths) : 0;

  const densityClass =
    lineCount <= 2 ? 'is-large' : lineCount === 3 ? 'is-medium' : 'is-compact';
  const layoutClass =
    lineCount === 2 && maxLength > 0 && minLength / maxLength >= 0.72
      ? 'is-staggered'
      : 'is-centered';

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
          <div
            className={`card-detail-modal__lyrics ${densityClass} ${layoutClass}`}
            aria-label="Lyrics"
          >
            {lyricLines.length > 0 ? (
              <div className="card-detail-modal__lyrics-lines">
                {lyricLines.map((line, index) => (
                  <p
                    key={`${card.id}-line-${index}`}
                    className={isLatinLine(line) ? 'is-latin' : ''}
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : null}
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
