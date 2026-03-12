import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from 'react';
import { clamp } from '../utils/math';

interface RotationPoint {
  x: number;
  y: number;
}

interface AlbumRotationHandlers {
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
}

interface AlbumRotationControls {
  viewportRef: RefObject<HTMLDivElement | null>;
  handlers: AlbumRotationHandlers;
  canOpenCard: () => boolean;
  isDragging: boolean;
}

const DRAG_THRESHOLD_PX = 8;
const CLICK_SUPPRESS_MS = 220;
const MAX_ROTATE_Y = 16;
const MAX_ROTATE_X = 7;
const ROTATE_Y_PER_PX = 0.15;
const ROTATE_X_PER_PX = 0.08;

export function useAlbumRotation(active: boolean): AlbumRotationControls {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startPointRef = useRef<RotationPoint>({ x: 0, y: 0 });
  const startRotationRef = useRef<RotationPoint>({ x: 0, y: 0 });
  const currentRotationRef = useRef<RotationPoint>({ x: 0, y: 0 });
  const targetRotationRef = useRef<RotationPoint>({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const suppressClickUntilRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const applyRotation = useCallback((x: number, y: number) => {
    const element = viewportRef.current;

    if (!element) {
      return;
    }

    element.style.setProperty('--album-rotate-y', `${y.toFixed(3)}deg`);
    element.style.setProperty('--album-rotate-x', `${x.toFixed(3)}deg`);
    element.style.setProperty('--album-nx', (y / MAX_ROTATE_Y).toFixed(4));
    element.style.setProperty('--album-ny', (x / MAX_ROTATE_X).toFixed(4));
  }, []);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const animate = useCallback(() => {
    const current = currentRotationRef.current;
    const target = targetRotationRef.current;
    const nextX = current.x + (target.x - current.x) * 0.18;
    const nextY = current.y + (target.y - current.y) * 0.18;

    currentRotationRef.current = { x: nextX, y: nextY };
    applyRotation(nextX, nextY);

    if (Math.abs(target.x - nextX) < 0.04 && Math.abs(target.y - nextY) < 0.04) {
      currentRotationRef.current = { ...target };
      applyRotation(target.x, target.y);
      stopAnimation();
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(animate);
  }, [applyRotation, stopAnimation]);

  const ensureAnimation = useCallback(() => {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = window.requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    applyRotation(0, 0);

    return () => {
      stopAnimation();
    };
  }, [applyRotation, stopAnimation]);

  const finishGesture = useCallback((didDrag: boolean) => {
    pointerIdRef.current = null;
    hasDraggedRef.current = false;
    setIsDragging(false);

    if (didDrag) {
      suppressClickUntilRef.current = Date.now() + CLICK_SUPPRESS_MS;
    }
  }, []);

  return {
    viewportRef,
    handlers: {
      onPointerDown: (event) => {
        if (!active) {
          return;
        }

        pointerIdRef.current = event.pointerId;
        startPointRef.current = { x: event.clientX, y: event.clientY };
        startRotationRef.current = { ...targetRotationRef.current };
        hasDraggedRef.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove: (event) => {
        if (!active || pointerIdRef.current !== event.pointerId) {
          return;
        }

        const deltaX = event.clientX - startPointRef.current.x;
        const deltaY = event.clientY - startPointRef.current.y;

        if (!hasDraggedRef.current && Math.hypot(deltaX, deltaY) >= DRAG_THRESHOLD_PX) {
          hasDraggedRef.current = true;
          setIsDragging(true);
        }

        const nextRotateY = clamp(
          startRotationRef.current.y + deltaX * ROTATE_Y_PER_PX,
          -MAX_ROTATE_Y,
          MAX_ROTATE_Y,
        );
        const nextRotateX = clamp(
          startRotationRef.current.x - deltaY * ROTATE_X_PER_PX,
          -MAX_ROTATE_X,
          MAX_ROTATE_X,
        );

        targetRotationRef.current = { x: nextRotateX, y: nextRotateY };
        ensureAnimation();
      },
      onPointerUp: (event) => {
        if (pointerIdRef.current !== event.pointerId) {
          return;
        }

        const didDrag = hasDraggedRef.current;
        event.currentTarget.releasePointerCapture(event.pointerId);
        finishGesture(didDrag);
      },
      onPointerCancel: (event) => {
        if (pointerIdRef.current !== event.pointerId) {
          return;
        }

        const didDrag = hasDraggedRef.current;
        finishGesture(didDrag);
      },
      onPointerLeave: () => {
        return;
      },
    },
    canOpenCard: () =>
      active &&
      !hasDraggedRef.current &&
      !isDragging &&
      Date.now() >= suppressClickUntilRef.current,
    isDragging,
  };
}
