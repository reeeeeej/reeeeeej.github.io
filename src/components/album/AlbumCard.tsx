import type { MouseEvent } from 'react';
import type { HeartLayoutCard } from '../../hooks/useHeartLayout3D';
import type { DeviceProfile } from '../../types/scene';
import type { BrowserProfile } from '../../utils/browser';

interface AlbumCardProps {
  card: HeartLayoutCard;
  profile: DeviceProfile;
  browserProfile: BrowserProfile;
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
  browserProfile,
  entering,
  exiting,
  entryIndex,
  selected,
  canOpenCard,
  onSelect,
}: AlbumCardProps) {
  const isMobileProfile = profile !== 'desktop';
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
    profile === 'desktop' &&
    browserProfile !== 'ios-safari' &&
    card.depthGroup !== 'background';
  const mobileTiltX = isMobileProfile ? 0.4 : 1.1;
  const mobileYaw = isMobileProfile ? card.yawAngle * 0.32 : card.yawAngle ?? 0;
  const mobilePitch = isMobileProfile ? card.pitchAngle * 0.25 : card.pitchAngle ?? 0;
  const mobileTwist = isMobileProfile ? card.twistFactor * 0.38 : card.twistFactor;
  const mobileZ = isMobileProfile ? Math.round((card.z ?? 0) * 0.45) : card.z ?? 0;
  const isIosSafari = browserProfile === 'ios-safari';
  const cardTransform = isIosSafari
    ? `translate(-50%, -50%) rotate(${card.rotation ?? 0}deg) scale(${scaleByDepth})`
    : `translate3d(-50%, -50%, ${mobileZ}px) rotate(${card.rotation ?? 0}deg) rotateY(${mobileYaw}deg) rotateX(${mobilePitch}deg) rotateY(calc(var(--album-nx, 0) * ${mobileTwist} * 1deg)) rotateX(calc(var(--album-ny, 0) * -${mobileTiltX}deg)) scale(${scaleByDepth})`;

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      style={{
        left: `${card.x ?? 50}%`,
        top: `${card.y ?? 50}%`,
        transform: cardTransform,
        zIndex: Math.round(mobileZ + (card.y ?? 0)),
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
              loading={browserProfile === 'ios-safari' ? (entryIndex < 8 ? 'eager' : 'lazy') : entryIndex < 12 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={browserProfile === 'ios-safari' ? (entryIndex < 8 ? 'high' : 'low') : entryIndex < 12 ? 'high' : 'low'}
              sizes="64px"
            />
            <span className="album-card__shine" />
          </span>
        </span>
      </span>
    </button>
  );
}
