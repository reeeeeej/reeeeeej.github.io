import type { CardDepthGroup } from '../../types/card';
import type { HeartLayoutCard } from '../../hooks/useHeartLayout3D';
import type { DeviceProfile } from '../../types/scene';
import { AlbumCard } from './AlbumCard';

interface AlbumCardLayerProps {
  cards: HeartLayoutCard[];
  profile: DeviceProfile;
  depthGroup: CardDepthGroup;
  entering: boolean;
  exiting: boolean;
  selectedCardId: string | null;
  canOpenCard: () => boolean;
  onCardSelect: (cardId: string) => void;
}

const driftFactorByDepth: Record<CardDepthGroup, number> = {
  background: 0.5,
  midground: 0.8,
  foreground: 1.15,
};

export function AlbumCardLayer({
  cards,
  profile,
  depthGroup,
  entering,
  exiting,
  selectedCardId,
  canOpenCard,
  onCardSelect,
}: AlbumCardLayerProps) {
  const profileMultiplier =
    profile === 'mobile-low'
      ? 0.46
      : profile === 'mobile-mid'
        ? 0.58
        : profile === 'mobile-high'
          ? 0.72
          : 1;
  const driftFactor = driftFactorByDepth[depthGroup] * profileMultiplier;

  return (
    <div
      className={`album-card-layer album-card-layer--${depthGroup}`}
      style={{
        ['--layer-drift-factor' as string]: driftFactor,
      }}
    >
      <div
        className={`album-card-layer__inner ${entering ? 'is-entering' : ''} ${exiting ? 'is-exiting' : ''}`}
      >
        {cards.map((card, index) => (
          <AlbumCard
            key={card.id}
            card={card}
            profile={profile}
            entering={entering}
            exiting={exiting}
            entryIndex={index}
            selected={card.id === selectedCardId}
            canOpenCard={canOpenCard}
            onSelect={onCardSelect}
          />
        ))}
      </div>
    </div>
  );
}
