import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/* The hero's backdrop as a fragment shader: the deck's four pastels (yellow / cyan / peach / lilac) are soft round
   fields that a domain-warped noise keeps bending. The cursor only makes ripples: moving sends rings out from its
   path, a click drops a splash. The colours themselves never change — the waves bend the picture and catch the light.
   Scrolling slides the flow.

   Light on purpose: one triangle, drawn well below the screen's pixel density (a soft gradient doesn't need more),
   at 30 fps while nothing is happening, only while the hero is on screen, with the ripple loop skipped when none is
   alive, and a quality knob that steps down by itself if frames get slow. The grain is a static CSS layer, not shader work.
   Plain WebGL, no library. If WebGL is missing (or motion is reduced) nothing is drawn and the CSS blobs stay in charge. */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

// __N__ = how many strokes can be alive at once (set from the GPU's uniform budget)
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define N __N__
#define LIFE 1.5
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform float uIntro;
uniform float uCount;
uniform vec4 uSeg[N];   // a stroke segment: from (xy) to (zw), in screen-height units
uniform vec2 uInfo[N];  // birth time, strength

// "hash without sine": uniform in 0..1
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}
// a soft round field: 1 at the centre, fading out towards radius r
float field(vec2 p, vec2 c, float r) {
  float d = length(p - c) / r;
  return exp(-d * d * 1.7);
}
void main() {
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(vUv.x * asp, vUv.y); // x: 0..aspect, y: 0 (bottom) .. 1 (top)
  float t = uTime * 0.07;

  // ── ripples: every live stroke sends rings out from its path ──
  vec2 push = vec2(0.0);
  float shine = 0.0;
  for (int i = 0; i < N; i++) {
    if (float(i) >= uCount) break;
    float age = uTime - uInfo[i].x;
    if (age > LIFE || age < 0.0) continue;
    vec2 a = uSeg[i].xy;
    vec2 ba = uSeg[i].zw - a;
    float h = clamp(dot(p - a, ba) / max(dot(ba, ba), 0.00001), 0.0, 1.0);
    vec2 dv = p - (a + ba * h);                 // from the nearest point of the stroke to this pixel
    float d = length(dv);

    // a travelling bump with a few crests riding it; it spreads outward and dies down
    float ring = d - age * 0.3;
    float wave = sin(ring * 46.0) * exp(-ring * ring * 60.0) * exp(-age * 1.7) * uInfo[i].y;
    push += dv / max(d, 0.001) * wave * 0.024; // the picture is bent along the wave...
    shine += wave;                              // ...and the crests catch the light (white up, grey down: no hue change)
  }
  p += push;

  // scrolling slides the flow upwards
  p.y += uScroll * 0.45;

  // domain warp: the coordinates the colour fields are read from get bent by noise (fine detail) and a slow swell
  // (zero-mean by construction). Kept small, so the fields flow around their homes instead of leaving them —
  // the screen only spans a handful of noise cells, so a big noise warp would just shove the whole picture one way.
  vec2 q = vec2(fbm(p * 2.8 + vec2(0.0, t)), fbm(p * 2.8 + vec2(5.2, 1.3) - t));
  vec2 w = p + (q - 0.44) * 0.4 + 0.07 * vec2(sin(p.y * 3.4 + t * 9.0), cos(p.x * 3.0 - t * 8.0));

  // the four colour fields keep the deck's composition and wander around their home;
  // on a tall screen (phones) they shrink and spread out vertically, or yellow and cyan would melt into one mint wash
  float port = smoothstep(1.0, 0.6, asp);
  float k = mix(0.5, 1.0, uIntro) * mix(1.0, 0.72, port);
  vec2 yHome = vec2(mix(0.44, 0.26, port) * asp, mix(0.94, 0.97, port)) + 0.07 * vec2(sin(t * 2.3), cos(t * 1.7));
  vec2 cHome = vec2(mix(0.95, 1.02, port) * asp, mix(0.86, 0.76, port)) + 0.07 * vec2(cos(t * 2.0 + 1.0), sin(t * 2.4));
  vec2 pHome = vec2(mix(0.08, 0.0, port) * asp, mix(0.62, 0.5, port)) + 0.07 * vec2(sin(t * 1.8 + 2.0), cos(t * 2.2));
  vec2 lHome = vec2(mix(0.14, 0.5, port) * asp, mix(0.04, 0.02, port)) + 0.07 * vec2(cos(t * 2.6 + 3.0), sin(t * 1.9 + 1.0));

  vec3 base = vec3(0.918, 0.902, 0.890);   // #eae6e3
  vec3 yellow = vec3(0.953, 1.000, 0.180); // #f3ff2e
  vec3 cyan = vec3(0.561, 0.957, 1.000);   // #8ff4ff
  vec3 peach = vec3(1.000, 0.804, 0.741);  // #ffcdbd
  vec3 lilac = vec3(0.827, 0.784, 1.000);  // #d3c8ff

  vec3 col = base;
  col = mix(col, lilac, clamp(field(w, lHome, 0.62 * k) * 0.95, 0.0, 1.0));
  col = mix(col, peach, clamp(field(w, pHome, 0.60 * k) * 0.95, 0.0, 1.0));
  col = mix(col, yellow, clamp(field(w, yHome, 0.5 * k) * 0.98, 0.0, 1.0));
  col = mix(col, cyan, clamp(field(w, cHome, 0.6 * k) * 0.97, 0.0, 1.0)); // on top, so the corner stays cyan

  // loose veins of colour drifting through the middle, so the field never reads as four dots
  col = mix(col, lilac, smoothstep(0.5, 0.8, q.x) * 0.28);
  col = mix(col, cyan, smoothstep(0.52, 0.82, q.y) * 0.22);
  col += smoothstep(0.5, 0.85, q.y) * 0.05; // a faint sheen

  col += shine * 0.1; // ripple crests (and troughs) lighten (and darken) whatever colour is under them

  gl_FragColor = vec4(mix(base, col, smoothstep(0.0, 1.0, uIntro)), 1.0);
}`

const LIFE = 1.5 // seconds a stroke lives — keep in step with LIFE in the shader

type Props = {
  /** the preloader is done: the colour swells in */
  ready: boolean
  /** true while the shader is drawing (the CSS blobs step aside), false if it can't or stops */
  onActive: (on: boolean) => void
}

export default function HeroShader({ ready, onActive }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const intro = useRef({ v: 0 })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || prefersReducedMotion()) return

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' })
    if (!gl) return

    // strokes alive at once: 2 uniform vectors each, so stay well inside what the GPU offers
    const budget = Number(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS)) || 16
    const N = budget >= 100 ? 20 : budget >= 48 ? 12 : 6
    const segs = new Float32Array(N * 4)
    const info = new Float32Array(N * 2).fill(0)
    for (let i = 0; i < N; i++) info[i * 2] = -1000 // born long ago = dead
    let head = 0
    let count = 0
    let lastDrop = -1000

    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    type Loc = Record<'res' | 'time' | 'scroll' | 'intro' | 'count' | 'seg' | 'info', WebGLUniformLocation | null>
    let loc: Loc | null = null

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('HeroShader:', gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
      }
      return s
    }

    // (re)creates every GL object — also used after a lost context
    const build = () => {
      const vs = compile(gl.VERTEX_SHADER, VERT)
      const fs = compile(gl.FRAGMENT_SHADER, FRAG.replace(/__N__/g, String(N)))
      if (!vs || !fs) return false
      program = gl.createProgram()!
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false
      gl.useProgram(program)

      buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW) // one triangle covers the screen
      const a = gl.getAttribLocation(program, 'aPos')
      gl.enableVertexAttribArray(a)
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)

      const u = (n: string) => gl.getUniformLocation(program!, n)
      loc = { res: u('uRes'), time: u('uTime'), scroll: u('uScroll'), intro: u('uIntro'), count: u('uCount'), seg: u('uSeg'), info: u('uInfo') }
      return true
    }

    if (!build()) return

    // ── size: draw far below the screen's pixel density; `quality` steps down if frames get slow ──
    let cssW = 1
    let cssH = 1
    let quality = 1
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      cssW = Math.max(1, r.width)
      cssH = Math.max(1, r.height)
      const scale = Math.min(window.devicePixelRatio || 1, 1) * (cssW < 800 ? 0.6 : 0.5) * quality
      canvas.width = Math.max(2, Math.round(cssW * scale))
      canvas.height = Math.max(2, Math.round(cssH * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    // only draw while the hero is on screen and the tab is visible
    let visible = true
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(canvas)

    // ── ripples: the pointer's path becomes short segments, each one a stroke that lives LIFE seconds ──
    const pen = { x: 0, y: 0, t: -10 }
    const spawn = (ax: number, ay: number, bx: number, by: number, strength: number, now: number) => {
      segs.set([ax, ay, bx, by], head * 4)
      info[head * 2] = now
      info[head * 2 + 1] = strength
      head = (head + 1) % N
      count = Math.min(count + 1, N)
      lastDrop = now
    }
    // pointer → the shader's space: x in screen-height units (0..aspect), y 0 (bottom) .. 1 (top)
    const toLocal = (e: PointerEvent) => ({
      x: (e.clientX / cssW) * (cssW / cssH),
      y: 1 - (e.clientY + window.scrollY) / cssH, // the hero is the top of the page
    })
    // the pen's pacing uses the event clock (exact); a stroke's birth uses the ticker's, the one the shader reads
    const eventClock = () => performance.now() / 1000
    const onMove = (e: PointerEvent) => {
      const now = eventClock()
      const { x, y } = toLocal(e)
      if (!visible) return
      if (now - pen.t > 0.3) {
        // a pause or a jump: start a fresh line instead of joining the old one
        pen.x = x
        pen.y = y
        pen.t = now
        return
      }
      const dist = Math.hypot(x - pen.x, y - pen.y)
      if (dist < 0.014 || now - pen.t < 0.05) return // let the segment grow a little before committing it
      spawn(pen.x, pen.y, x, y, Math.min(1, Math.max(0.35, dist / 0.06)), gsap.ticker.time)
      pen.x = x
      pen.y = y
      pen.t = now
    }
    const onDown = (e: PointerEvent) => {
      if (!visible) return
      const { x, y } = toLocal(e)
      spawn(x, y, x + 0.0001, y, 1.3, gsap.ticker.time) // a splash: ripples with no drag
      pen.x = x
      pen.y = y
      pen.t = eventClock()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })

    let lost = false
    let sinceDraw = 0
    let avg = 16.7 // smoothed frame time (ms)
    let slowFrames = 0
    const tick = (time: number, deltaTime: number) => {
      if (lost || !visible || document.hidden || !program || !loc) return

      // quality: if frames stay slow (sustained, not a one-off hiccup), draw fewer pixels
      if (deltaTime > 0 && deltaTime < 120) {
        avg += (deltaTime - avg) * 0.05
        slowFrames = avg > 26 ? slowFrames + 1 : 0
        if (slowFrames > 90 && quality > 0.55) {
          quality = Math.max(0.55, quality - 0.15)
          slowFrames = 0
          avg = 16.7
          resize()
        }
      }

      // nothing alive → half the frames: the gradient drifts far too slowly to need more
      const drawing = time - lastDrop < LIFE + 0.1
      sinceDraw += deltaTime
      if (!drawing && sinceDraw < 28) return
      sinceDraw = 0

      gl.uniform2f(loc.res, canvas.width, canvas.height)
      gl.uniform1f(loc.time, time)
      gl.uniform1f(loc.scroll, Math.min(1, Math.max(0, window.scrollY / cssH)))
      gl.uniform1f(loc.intro, intro.current.v)
      gl.uniform1f(loc.count, drawing ? count : 0) // no live ripple: the shader skips the whole loop
      if (drawing) {
        gl.uniform4fv(loc.seg, segs)
        gl.uniform2fv(loc.info, info)
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    gsap.ticker.add(tick)

    const onLost = (e: Event) => {
      e.preventDefault() // lets the browser restore the context
      lost = true
      onActive(false) // blobs take over meanwhile
    }
    const onRestored = () => {
      if (build()) {
        lost = false
        onActive(true)
      }
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    onActive(true)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      // free the GL objects but keep the context alive (a lost context can't be re-acquired on the same canvas — strict mode remounts)
      if (program) gl.deleteProgram(program)
      if (buffer) gl.deleteBuffer(buffer)
      onActive(false)
    }
  }, [onActive])

  // the colour swells in once the preloader hands over
  useEffect(() => {
    if (!ready) return
    const tween = gsap.to(intro.current, { v: 1, duration: 2.6, ease: 'power2.out' })
    return () => {
      tween.kill()
    }
  }, [ready])

  return <canvas ref={ref} className="hero__shader" aria-hidden="true" />
}
