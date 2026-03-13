import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AlbumScene } from '../components/album/AlbumScene';
import { ParticlesLayer } from '../components/background/ParticlesLayer';
import { Starfield } from '../components/background/Starfield';
import { CakeScene } from '../components/cake/CakeScene';
import { GestureEntry } from '../components/gesture/GestureEntry';
import { OpeningScene } from '../components/intro/OpeningScene';
import { CardDetailModal } from '../components/modal/CardDetailModal';
import { SceneTransitionLayer } from '../components/transition/SceneTransitionLayer';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { cards } from '../data/cards';
import { sceneConfig } from '../data/scene';
import { themeConfig } from '../data/theme';
import { useCardSelection } from '../hooks/useCardSelection';
import { useDeviceProfile } from '../hooks/useDeviceProfile';
import { useSceneStage } from '../hooks/useSceneStage';
import type { SceneStage } from '../types/scene';

type CakeVisualStage =
  | 'cake'
  | 'intro-reveal'
  | 'transition-to-album'
  | 'transition-to-cake'
  | null;
type AlbumVisualState = 'hidden' | 'entering' | 'active' | 'exiting';
type SettleState = 'none' | 'to-album' | 'to-cake';

const VISUAL_SETTLE_MS = 220;

export function App() {
  const {
    sceneStage,
    reducedMotionPreferred,
    beginCakeScene,
    beginAlbumTransition,
    beginCakeReturn,
  } =
    useSceneStage();
  const deviceProfile = useDeviceProfile();
  const { selectedCard, closeDetail, selectedCardId, openDetail } =
    useCardSelection();
  const previousStageRef = useRef<SceneStage | null>(null);
  const hasStartedPreloadRef = useRef(false);
  const [cakeVisualStage, setCakeVisualStage] = useState<CakeVisualStage>(null);
  const [albumVisualState, setAlbumVisualState] =
    useState<AlbumVisualState>('hidden');
  const [settleState, setSettleState] = useState<SettleState>('none');
  const [transitionDirection, setTransitionDirection] = useState<
    'to-album' | 'to-cake' | null
  >(null);

  const appTheme = {
    '--bg-base': themeConfig.background.base,
    '--bg-accent': themeConfig.background.accent,
    '--bg-glow': themeConfig.background.glow,
    '--cake-frosting': themeConfig.cake.frosting,
    '--cake-highlight': themeConfig.cake.highlight,
    '--cake-shadow': themeConfig.cake.shadow,
    '--text-primary': themeConfig.text.primary,
    '--text-secondary': themeConfig.text.secondary,
  } as CSSProperties;

  const showLoading = sceneStage === 'loading';
  const showIntro = sceneStage === 'intro' || sceneStage === 'intro-transition';
  const settleDuration = reducedMotionPreferred ? 40 : VISUAL_SETTLE_MS;

  useEffect(() => {
    if (hasStartedPreloadRef.current || sceneStage === 'loading') {
      return;
    }

    hasStartedPreloadRef.current = true;
    const coverSources = Array.from(
      new Set(cards.map((card) => card.coverImage || card.image).filter(Boolean)),
    );
    const timers: number[] = [];

    const startPreload = () => {
      coverSources.forEach((src, index) => {
        const timer = window.setTimeout(() => {
          const image = new Image();
          image.decoding = 'async';
          image.fetchPriority = index < 6 ? 'high' : 'low';
          image.src = src;
          if (typeof image.decode === 'function') {
            void image.decode().catch(() => undefined);
          }
        }, index * 90);

        timers.push(timer);
      });
    };

    const kickoff = window.setTimeout(startPreload, 120);

    return () => {
      window.clearTimeout(kickoff);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [sceneStage]);

  useEffect(() => {
    const previousStage = previousStageRef.current;
    previousStageRef.current = sceneStage;

    const settleTimer =
      sceneStage === 'album' || sceneStage === 'cake'
        ? window.setTimeout(() => {
            if (sceneStage === 'album') {
              setCakeVisualStage(null);
              setAlbumVisualState('active');
              setSettleState('none');
              setTransitionDirection(null);
              return;
            }

            setCakeVisualStage('cake');
            setAlbumVisualState('hidden');
            setSettleState('none');
            setTransitionDirection(null);
          }, settleDuration)
        : null;

    if (sceneStage === 'loading' || sceneStage === 'intro') {
      setCakeVisualStage(null);
      setAlbumVisualState('hidden');
      setSettleState('none');
      setTransitionDirection(null);
    } else if (sceneStage === 'intro-transition') {
      setCakeVisualStage('intro-reveal');
      setAlbumVisualState('hidden');
      setSettleState('none');
      setTransitionDirection(null);
    } else if (sceneStage === 'transition-to-album') {
      setCakeVisualStage('transition-to-album');
      setAlbumVisualState('entering');
      setSettleState('none');
      setTransitionDirection('to-album');
    } else if (sceneStage === 'transition-to-cake') {
      setCakeVisualStage('transition-to-cake');
      setAlbumVisualState('exiting');
      setSettleState('none');
      setTransitionDirection('to-cake');
    } else if (sceneStage === 'album') {
      if (previousStage === 'transition-to-album') {
        setCakeVisualStage('transition-to-album');
        setAlbumVisualState('entering');
        setSettleState('to-album');
        setTransitionDirection('to-album');
      } else {
        setCakeVisualStage(null);
        setAlbumVisualState('active');
        setSettleState('none');
        setTransitionDirection(null);
      }
    } else if (sceneStage === 'detail') {
      setCakeVisualStage(null);
      setAlbumVisualState('active');
      setSettleState('none');
      setTransitionDirection(null);
    } else if (sceneStage === 'cake') {
      if (previousStage === 'transition-to-cake') {
        setCakeVisualStage('cake');
        setAlbumVisualState('exiting');
        setSettleState('to-cake');
        setTransitionDirection('to-cake');
      } else {
        setCakeVisualStage('cake');
        setAlbumVisualState('hidden');
        setSettleState('none');
        setTransitionDirection(null);
      }
    }

    return () => {
      if (settleTimer) {
        window.clearTimeout(settleTimer);
      }
    };
  }, [reducedMotionPreferred, sceneStage, settleDuration]);

  const showCake = cakeVisualStage !== null;
  const showAlbum = albumVisualState !== 'hidden' || sceneStage === 'detail';

  return (
    <div
      className={`app-shell ${reducedMotionPreferred ? 'is-reduced-motion' : ''}`}
      data-scene-stage={sceneStage}
      data-device-profile={deviceProfile}
      style={appTheme}
    >
      <Starfield profile={deviceProfile} />
      <ParticlesLayer profile={deviceProfile} sceneStage={sceneStage} />

      <main className="app-frame">
        {showCake ? (
          <CakeScene
            sceneConfig={sceneConfig}
            profile={deviceProfile}
            stage={cakeVisualStage ?? 'cake'}
            settling={settleState === 'to-cake'}
            interactionLocked={transitionDirection !== null || sceneStage === 'intro-transition'}
            revealing={sceneStage === 'intro-transition'}
            onActivate={beginAlbumTransition}
          />
        ) : null}

        {showIntro ? (
          <OpeningScene
            onOpen={beginCakeScene}
            exiting={sceneStage === 'intro-transition'}
          />
        ) : null}

        {showAlbum ? (
          <AlbumScene
            cards={cards}
            profile={deviceProfile}
            selectedCardId={selectedCardId}
            active={
              albumVisualState === 'active' || sceneStage === 'detail'
            }
            onCardSelect={openDetail}
            onBack={beginCakeReturn}
            sceneStage={sceneStage}
            visualState={albumVisualState}
            settling={settleState === 'to-album'}
          />
        ) : null}

        <SceneTransitionLayer
          direction={transitionDirection}
          profile={deviceProfile}
          settling={settleState !== 'none'}
        />

        {showLoading ? <LoadingScreen title={sceneConfig.title} /> : null}
      </main>

      <GestureEntry />

      <CardDetailModal card={selectedCard} onClose={closeDetail} />
    </div>
  );
}
