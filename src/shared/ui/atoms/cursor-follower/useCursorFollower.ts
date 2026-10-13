'use client';

import { useEffect, useState, type RefObject } from 'react';
import {
  classifyHoverTarget,
  DOT_SIZE,
  shapeAround,
  snapsOnExit,
  stepSpring,
  targetShape,
  ZERO_SHAPE,
  wrapsElement,
  type CursorMode,
  type CursorShape,
} from './cursorPhysics';

export interface CursorFollowerState {
  mode: CursorMode;
  visible: boolean;
}

const OFFSCREEN = -100;

function writeGeometry(element: HTMLElement, shape: CursorShape) {
  element.style.setProperty('--cursor-x', `${shape.x}px`);
  element.style.setProperty('--cursor-y', `${shape.y}px`);
  element.style.setProperty('--cursor-width', `${Math.max(0, shape.width)}px`);
  element.style.setProperty('--cursor-height', `${Math.max(0, shape.height)}px`);
  element.style.setProperty('--cursor-radius', `${Math.max(0, shape.radius)}px`);
}

/**
 * Drives the cursor follower: listens to the pointer, springs the element's geometry towards
 * its target every animation frame (through CSS variables) and reports the visual mode.
 * Everything is torn down on unmount.
 */
export function useCursorFollower(followerRef: RefObject<HTMLElement | null>): CursorFollowerState {
  const [mode, setMode] = useState<CursorMode>('dot');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    const pointer = { x: OFFSCREEN, y: OFFSCREEN };
    let position = shapeAround(pointer, DOT_SIZE);
    let velocity = ZERO_SHAPE;
    let hover: { mode: CursorMode; element: Element | null } = { mode: 'dot', element: null };
    let hasPointer = false;
    let frameId = 0;

    const onMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!hasPointer) {
        hasPointer = true;
        position = shapeAround(pointer, DOT_SIZE);
      }
      setVisible(true);
    };
    const onOver = (event: MouseEvent) => {
      const next = classifyHoverTarget(event.target);
      const snaps = snapsOnExit(hover.mode, next.mode);
      hover = next;
      if (snaps) {
        // Jump now, before the new style paints, so no frame shows it on the card's shape.
        position = currentTarget();
        velocity = ZERO_SHAPE;
        writeGeometry(follower, position);
      }
      setMode(hover.mode);
    };
    const onOut = (event: MouseEvent) => {
      if (!event.relatedTarget) setVisible(false);
    };

    const currentTarget = () => {
      const element = hover.element?.isConnected ? hover.element : null;
      return targetShape(pointer, {
        mode: element || !wrapsElement(hover.mode) ? hover.mode : 'dot',
        rect: element ? element.getBoundingClientRect() : null,
        borderRadius: element
          ? Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0
          : 0,
      });
    };

    const frame = () => {
      ({ position, velocity } = stepSpring(position, velocity, currentTarget()));
      writeGeometry(follower, position);
      frameId = requestAnimationFrame(frame);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut);
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [followerRef]);

  return { mode, visible };
}
