import type { AlbumCardItem } from '../../types/card';
import { useHeartLayout3D } from '../../hooks/useHeartLayout3D';
import type { DeviceProfile, SceneStage } from '../../types/scene';
import type { BrowserProfile } from '../../utils/browser';
import { AlbumBackButton } from './AlbumBackButton';
import { AlbumCardLayer } from './AlbumCardLayer';
import { AlbumViewport } from './AlbumViewport';

interface AlbumSceneProps {
  cards: AlbumCardItem[];
  profile: DeviceProfile;
  browserProfile: BrowserProfile;
  selectedCardId: string | null;
  active: boolean;
  sceneStage: SceneStage;
  visualState: 'hidden' | 'entering' | 'active' | 'exiting';
  settling?: boolean;
  onCardSelect: (cardId: string) => void;
  onBack: () => void;
}

export function AlbumScene({
  cards,
  profile,
  browserProfile,
  selectedCardId,
  active,
  sceneStage,
  visualState,
  settling = false,
  onCardSelect,
  onBack,
}: AlbumSceneProps) {
  const isEntering = visualState === 'entering';
  const isExiting = visualState === 'exiting';
  const layoutCards = useHeartLayout3D(cards);
  const backgroundCards = layoutCards.filter((card) => card.depthGroup === 'background');
  const midgroundCards = layoutCards.filter((card) => card.depthGroup === 'midground');
  const foregroundCards = layoutCards.filter((card) => card.depthGroup === 'foreground');

  return (
    <section
      className={`album-scene ${active ? 'is-active' : ''} ${isEntering ? 'is-entering' : ''} ${isExiting ? 'is-exiting' : ''}`}
      data-settling={settling ? 'true' : 'false'}
    >
      <header className="album-scene__header">
        <p className="album-scene__eyebrow">Memory Sign</p>
        <h2 className="album-scene__title">ANNIVERSARY</h2>
        <p className="album-scene__subtitle">
          Swipe to tilt. Tap a photo to unfold its note.
        </p>
      </header>

      <AlbumViewport
        active={active}
        entering={isEntering}
        exiting={isExiting}
        profile={profile}
        browserProfile={browserProfile}
      >
        {({ canOpenCard }) => (
          <>
            <AlbumCardLayer
              cards={backgroundCards}
              profile={profile}
              browserProfile={browserProfile}
              depthGroup="background"
              entering={isEntering}
              exiting={isExiting}
              selectedCardId={selectedCardId}
              canOpenCard={canOpenCard}
              onCardSelect={onCardSelect}
            />
            <AlbumCardLayer
              cards={midgroundCards}
              profile={profile}
              browserProfile={browserProfile}
              depthGroup="midground"
              entering={isEntering}
              exiting={isExiting}
              selectedCardId={selectedCardId}
              canOpenCard={canOpenCard}
              onCardSelect={onCardSelect}
            />
            <AlbumCardLayer
              cards={foregroundCards}
              profile={profile}
              browserProfile={browserProfile}
              depthGroup="foreground"
              entering={isEntering}
              exiting={isExiting}
              selectedCardId={selectedCardId}
              canOpenCard={canOpenCard}
              onCardSelect={onCardSelect}
            />
          </>
        )}
      </AlbumViewport>

      {sceneStage === 'album' ? <AlbumBackButton onClick={onBack} /> : null}
    </section>
  );
}
