import type { MouseEvent } from 'react';
import type { HeartLayoutCard } from '../../hooks/useHeartLayout3D';
import type { DeviceProfile } from '../../types/scene';

interface AlbumCardProps {
  card: HeartLayoutCard;
  profile: DeviceProfile;
  entering: boolean;
  exiting: boolean;
  entryIndex: number;
  selected: boolean;
  canOpenCard: () => boolean;
  onSelect: (cardId: string) => void;
}

export function AlbumCard({
  card,
  profile,
  entering,
  exiting,
  entryIndex,
  selected,
  canOpenCard,
  onSelect,
}: AlbumCardProps) {
  const classes = [
    'album-card',
    `album-card--${card.sizeType}`,
    `album-card--${card.depthGroup}`,
    'is-interactive',
    selected ? 'is-selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!canOpenCard()) {
      event.preventDefault();
      return;
    }

    onSelect(card.id);
  };

  const scaleByDepth =
    card.depthGroup === 'foreground' ? 1.03 : card.depthGroup === 'midground' ? 0.98 : 0.93;
  const showDust =
    profile === 'desktop' ||
    (profile === 'mobile-high' && card.depthGroup !== 'background');

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      style={{
        left: `${card.x ?? 50}%`,
        top: `${card.y ?? 50}%`,
        transform: `translate3d(-50%, -50%, ${card.z ?? 0}px) rotate(${card.rotation ?? 0}deg) rotateY(${card.yawAngle ?? 0}deg) rotateX(${card.pitchAngle ?? 0}deg) rotateY(calc(var(--album-nx, 0) * ${card.twistFactor} * 1deg)) rotateX(calc(var(--album-ny, 0) * -1.1deg)) scale(${scaleByDepth})`,
        zIndex: Math.round((card.z ?? 0) + (card.y ?? 0)),
        ['--card-delay' as string]: `${entryIndex * 28}ms`,
        ['--card-shift-x' as string]: `${((card.x ?? 50) - 50) * 0.34}%`,
        ['--card-shift-y' as string]: `${22 - (card.y ?? 50) * 0.12}%`,
        ['--card-drift' as string]: `${((card.x ?? 50) - 50) * 0.16}px`,
        ['--card-twist-factor' as string]: `${card.twistFactor}`,
      }}
      aria-label={`Open ${card.songTitle ?? card.title ?? 'album memory'}`}
    >
      <span
        className={`album-card__entry ${entering ? 'is-entering' : ''} ${exiting ? 'is-exiting' : ''}`}
      >
        <span
          className={`album-card__frame album-card__frame--${card.styleVariant ?? 'rose'}`}
        >
          {showDust ? (
            <>
              <span className="album-card__dust album-card__dust--top" />
              <span className="album-card__dust album-card__dust--left" />
              <span className="album-card__dust album-card__dust--right" />
              <span className="album-card__dust album-card__dust--bottom" />
            </>
          ) : null}
          <span className="album-card__photo-shell">
            <img
              className="album-card__image"
              src={card.coverImage || card.image}
              alt={card.songTitle ?? card.title ?? 'Album memory'}
              loading="lazy"
              decoding="async"
            />
            <span className="album-card__shine" />
          </span>
        </span>
      </span>
    </button>
  );
}
