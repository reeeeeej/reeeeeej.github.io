export type SceneStage =
  | 'loading'
  | 'intro'
  | 'intro-transition'
  | 'cake'
  | 'transition-to-album'
  | 'transition-to-cake'
  | 'album'
  | 'detail';

export type DeviceProfile =
  | 'mobile-low'
  | 'mobile-mid'
  | 'mobile-high'
  | 'desktop';

export interface SceneConfig {
  title: string;
  subtitle: string;
  hintText: string;
  maxInteractiveCards: number;
  totalCardCount: number;
  enableParticles: boolean;
  enableCakeGlow: boolean;
}
