"use client";

// Adapted from Aceternity UI's Wavy Background official registry.
// Container-sized, transparent waves with visibility and motion controls.
import { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { createNoise3D } from 'simplex-noise';

const monochrome = ['#080808', '#303030', '#515151', '#262626'];

export function WavyBackground({ paused = false, colors = monochrome, waveWidth = 22, blur = 8, waveOpacity = .18, speed = 'slow' }: {
  paused?: boolean; colors?: string[]; waveWidth?: number; blur?: number;
  waveOpacity?: number; speed?: 'slow' | 'fast';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0);
  const noise = useMemo(() => createNoise3D(), []);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !surface || !ctx) return;
    let width = 0, height = 0, frame = 0, previous = 0;
    let visible = false;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = waveOpacity;
      ctx.lineWidth = waveWidth;
      colors.forEach((color, index) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        for (let x = -20; x <= width + 20; x += 5) {
          const y = height * .5 + noise(x / 400, index * .35, phase.current) * height * .65;
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    };
    const animate = (time: number) => {
      phase.current += Math.min(previous ? time - previous : 0, 50) * (speed === 'slow' ? .0001 : .0002);
      previous = time;
      draw();
      frame = requestAnimationFrame(animate);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      const running = !paused && !reduced && visible && !document.hidden && width > 0 && height > 0;
      canvas.dataset.motion = running ? 'running' : 'paused';
      if (running) frame = requestAnimationFrame(animate);
    };
    const resize = () => {
      const bounds = surface.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(); sync();
    };
    const sizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    sizeObserver.observe(surface);
    visibilityObserver.observe(surface);
    document.addEventListener('visibilitychange', sync);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect(); visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [paused, reduced, noise, colors, waveWidth, waveOpacity, speed]);

  return <span className="dock-wave-surface" aria-hidden="true"><canvas ref={canvasRef} style={{ filter: `blur(${blur}px)` }} /></span>;
}
