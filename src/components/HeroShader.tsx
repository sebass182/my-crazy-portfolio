import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/* The hero's backdrop as a fragment shader: the deck's four pastels (yellow / cyan / peach / lilac) are soft round
   fields that a domain-warped noise keeps bending, a lens follows the cursor (drifts on its own when there is none,
   so phones get motion too), scrolling slides the flow, and a touch of grain keeps the gradient from banding.
   Plain WebGL: no library, one triangle, one program. If WebGL is missing (or motion is reduced) nothing is drawn and
   the CSS blobs underneath stay in charge — see onActive. */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uIntro;

// "hash without sine": uniform in 0..1 (the cheaper fract(x * y) variant skews low and drags the whole warp one way)
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
  for (int i = 0; i < 4; i++) {
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

  // the cursor is a lens that pushes the picture away from it
  vec2 m = vec2(uMouse.x * asp, uMouse.y);
  vec2 dm = p - m;
  float dl = length(dm);
  p += dm * exp(-dl * dl * 7.0) * 0.2;

  // scrolling slides the flow upwards
  p.y += uScroll * 0.45;

  // domain warp: the coordinates the colour fields are read from get bent by noise (fine detail) and a slow swell
  // (zero-mean by construction). Kept small, so the fields flow around their homes instead of leaving them —
  // the screen only spans a handful of noise cells, so a big noise warp would just shove the whole picture one way.
  vec2 q = vec2(fbm(p * 2.8 + vec2(0.0, t)), fbm(p * 2.8 + vec2(5.2, 1.3) - t));
  vec2 w = p + (q - 0.47) * 0.4 + 0.07 * vec2(sin(p.y * 3.4 + t * 9.0), cos(p.x * 3.0 - t * 8.0));

  // the four colour fields keep the deck's composition and wander around their home
  // on a tall screen (phones) the fields shrink and spread out vertically, or yellow and cyan would melt into one mint wash
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
  col = mix(col, lilac, smoothstep(0.55, 0.9, q.x) * 0.28);
  col = mix(col, cyan, smoothstep(0.58, 0.95, q.y) * 0.22);
  col += smoothstep(0.55, 1.0, q.y) * 0.05; // a faint sheen

  // light that follows the cursor
  col = mix(col, vec3(1.0), exp(-dl * dl * 12.0) * 0.3);

  // fine grain, re-rolled a dozen times a second
  float g = hash(gl_FragCoord.xy + floor(uTime * 12.0) * 17.3) - 0.5;
  col += g * 0.045;

  gl_FragColor = vec4(mix(base, col, smoothstep(0.0, 1.0, uIntro)), 1.0);
}`

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

    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    let loc: Record<'res' | 'time' | 'mouse' | 'scroll' | 'intro', WebGLUniformLocation | null> | null = null

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
      const fs = compile(gl.FRAGMENT_SHADER, FRAG)
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

      loc = {
        res: gl.getUniformLocation(program, 'uRes'),
        time: gl.getUniformLocation(program, 'uTime'),
        mouse: gl.getUniformLocation(program, 'uMouse'),
        scroll: gl.getUniformLocation(program, 'uScroll'),
        intro: gl.getUniformLocation(program, 'uIntro'),
      }
      return true
    }

    if (!build()) return

    // ── size: draw below the screen's pixel density, a soft gradient doesn't need more ──
    let cssW = 1
    let cssH = 1
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      cssW = Math.max(1, r.width)
      cssH = Math.max(1, r.height)
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (cssW < 800 ? 0.6 : 0.85)
      canvas.width = Math.max(2, Math.round(cssW * scale))
      canvas.height = Math.max(2, Math.round(cssH * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    // ── cursor: the target follows the pointer, the lens eases after it; with no pointer it wanders ──
    const target = { x: 0.62, y: 0.7 }
    const mouse = { x: 0.62, y: 0.7 }
    let lastMove = -10
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / cssW
      target.y = 1 - (e.clientY + window.scrollY) / cssH // the hero is the top of the page
      lastMove = performance.now() / 1000
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // ── only draw while the hero is on screen and the tab is visible ──
    let visible = true
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(canvas)

    let lost = false
    const tick = (time: number, deltaTime: number) => {
      if (lost || !visible || document.hidden || !program || !loc) return
      const dt = Math.min(deltaTime, 100) / 1000
      if (time - lastMove > 2.5) {
        target.x = 0.5 + 0.28 * Math.sin(time * 0.31)
        target.y = 0.62 + 0.2 * Math.cos(time * 0.43)
      }
      const ease = 1 - Math.exp(-dt * 3.5)
      mouse.x += (target.x - mouse.x) * ease
      mouse.y += (target.y - mouse.y) * ease

      gl.uniform2f(loc.res, canvas.width, canvas.height)
      gl.uniform1f(loc.time, time)
      gl.uniform2f(loc.mouse, mouse.x, mouse.y)
      gl.uniform1f(loc.scroll, Math.min(1, Math.max(0, window.scrollY / cssH)))
      gl.uniform1f(loc.intro, intro.current.v)
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
