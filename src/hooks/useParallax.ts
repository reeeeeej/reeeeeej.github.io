import { useRef, useState, type PointerEvent, type TouchEvent } from 'react';
import { clamp } from '../utils/math';

export interface ParallaxOffset {
  x: number;
  y: number;
}

export function useParallax(active: boolean) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  const updateOffset = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const normalizedX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = ((clientY - rect.top) / rect.height) * 2 - 1;

    setOffset({
      x: clamp(normalizedX, -1, 1),
      y: clamp(normalizedY, -1, 1),
    });
  };

  return {
    containerRef,
    offset,
    handlers: {
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        if (!active) {
          return;
        }

        updateOffset(event.clientX, event.clientY);
      },
      onPointerLeave: () => {
        setOffset({ x: 0, y: 0 });
      },
      onPointerUp: () => {
        setOffset({ x: 0, y: 0 });
      },
      onTouchMove: (event: TouchEvent<HTMLDivElement>) => {
        if (!active || event.touches.length === 0) {
          return;
        }

        const touch = event.touches[0];
        updateOffset(touch.clientX, touch.clientY);
      },
      onTouchStart: (event: TouchEvent<HTMLDivElement>) => {
        if (!active || event.touches.length === 0) {
          return;
        }

        const touch = event.touches[0];
        updateOffset(touch.clientX, touch.clientY);
      },
      onTouchEnd: () => {
        setOffset({ x: 0, y: 0 });
      },
    },
  };
}
