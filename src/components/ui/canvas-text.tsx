import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';

// Aceternity Canvas Text, adapted for a transparent hero, accessible text,
// inherited typography and the site's shared motion control.
const monochrome = ['#303030', '#626262', '#1c1c1c', '#494949'];
export function CanvasText({ text, className = '', colors = monochrome, baseColor = '#080808', animationDuration = 8, lineWidth = 2.4, lineGap = 6, curveIntensity = 38, paused = false }: {
  text: string; className?: string; colors?: string[]; baseColor?: string; animationDuration?: number;
  lineWidth?: number; lineGap?: number; curveIntensity?: number; paused?: boolean;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const textEl = textRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!textEl || !canvas || !ctx) return;
    let width = 0, height = 0, ratio = 1, frame = 0, previous = 0;
    let visible = false, disposed = false;
    let font = '', spacing = '0px';
    const resolvedColors = colors.map(color => color.startsWith('var(')
      ? getComputedStyle(document.documentElement).getPropertyValue(color.slice(4, -1)).trim() || '#303030'
      : color);
    const draw = () => {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.font = font;
      ctx.letterSpacing = spacing;
      const metrics = ctx.measureText(text);
      const baseline = (height + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      ctx.fillStyle = baseColor;
      ctx.fillText(text, 0, baseline);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.lineWidth = lineWidth;
      for (let i = -10; i < height / lineGap + 10; i++) {
        const y = i * lineGap;
        ctx.strokeStyle = resolvedColors[((i % resolvedColors.length) + resolvedColors.length) % resolvedColors.length];
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(width * .33, y + Math.sin(phase.current) * curveIntensity,
          width * .66, y + Math.sin(phase.current + .5) * curveIntensity * .6, width, y);
        ctx.stroke();
      }
      canvas.dataset.ready = 'true';
    };
    const animate = (time: number) => {
      phase.current += Math.min(previous ? time - previous : 0, 50) / (animationDuration * 1000) * Math.PI * 2;
      previous = time;
      draw();
      frame = requestAnimationFrame(animate);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      const running = !paused && !reduced && visible && !document.hidden && width > 0;
      canvas.dataset.motion = running ? 'running' : 'paused';
      if (running) frame = requestAnimationFrame(animate);
    };
    const resize = () => {
      if (disposed) return;
      const bounds = textEl.getBoundingClientRect();
      const style = getComputedStyle(textEl);
      width = bounds.width; height = bounds.height;
      font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      spacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(width * ratio); canvas.height = Math.ceil(height * ratio);
      draw(); sync();
    };
    const sizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    sizeObserver.observe(textEl); visibilityObserver.observe(textEl);
    document.addEventListener('visibilitychange', sync);
    document.fonts.ready.then(resize);
    resize();
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      sizeObserver.disconnect(); visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [text, colors, baseColor, animationDuration, lineWidth, lineGap, curveIntensity, paused, reduced]);

  return <span className={`canvas-text ${className}`} style={{ '--canvas-text-base': baseColor } as CSSProperties}><span ref={textRef} className="canvas-text-fallback">{text}</span><canvas ref={canvasRef} aria-hidden="true" /></span>;
}
