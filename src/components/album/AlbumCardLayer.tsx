import type { CardDepthGroup } from '../../types/card';
import type { HeartLayoutCard } from '../../hooks/useHeartLayout3D';
import { AlbumCard } from './AlbumCard';

interface AlbumCardLayerProps {
  cards: HeartLayoutCard[];
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
  depthGroup,
  entering,
  exiting,
  selectedCardId,
  canOpenCard,
  onCardSelect,
}: AlbumCardLayerProps) {
  const driftFactor = driftFactorByDepth[depthGroup];

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
