import { useEffect, useRef } from 'react';
import fragmentSource from './liquid-chrome.frag?raw';

// The supplied hero's original fluid field and chrome lighting shader.
// Render it directly so the page does not need a second framework or renderer.
export function LiquidChrome({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Unable to create chrome shader');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Chrome shader compilation failed');
      return shader;
    };
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    if (!program || !buffer) return;
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, 'attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}'));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Chrome shader link failed');
    } catch (error) {
      console.warn('Liquid chrome unavailable; using the static hero background.', error);
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const time = gl.getUniformLocation(program, 'uTime');
    const resolution = gl.getUniformLocation(program, 'uResolution');
    const mouse = gl.getUniformLocation(program, 'uMouse');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const target = { x: .5, y: .5 };
    const current = { ...target };
    let visible = true;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let dirty = true;
    let lost = false;
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      // Ray marching is expensive: cap its pixel budget independently of text/UI.
      const ratio = Math.min(window.devicePixelRatio || 1, 1, Math.sqrt(650000 / Math.max(1, width * height)));
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      dirty = true;
    };
    const move = (event: PointerEvent) => {
      if (reduced.matches || pausedRef.current || event.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
    };
    const leave = () => { target.x = .5; target.y = .5; };
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden || lost) { last = now; return; }
      if (now - last < 1000 / 30 && !dirty) return;
      const delta = Math.min((now - last) / 1000, .05);
      last = now;
      const animate = !reduced.matches && !pausedRef.current;
      if (!animate && !dirty) return;
      if (animate) {
        elapsed += delta;
        current.x += (target.x - current.x) * .12;
        current.y += (target.y - current.y) * .12;
      }
      gl.uniform1f(time, elapsed);
      gl.uniform2f(mouse, current.x, current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      canvas.dataset.ready = 'true';
      dirty = false;
    };
    const contextLost = (event: Event) => { event.preventDefault(); lost = true; delete canvas.dataset.ready; };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: 0 });
    observer.observe(host);
    intersection.observe(host);
    window.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', leave);
    canvas.addEventListener('webglcontextlost', contextLost);
    resize();
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('webglcontextlost', contextLost);
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="chrome-canvas" aria-hidden="true" />;
}

