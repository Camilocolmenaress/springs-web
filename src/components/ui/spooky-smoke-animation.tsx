"use client";

import { useEffect, useRef } from "react";

// ─── Fragment shader ──────────────────────────────────────────────────────────
// u_color: color que tiñe las partes más brillantes del ruido fractal.
// Para Springs: pasar #6B1419 (burgundy) da humo rojo profundo.

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  vec2 uv=(FC-.5*R)/R.y;
  vec3 col=vec3(1);
  uv.x+=.25;
  uv*=vec2(2,1);

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);

  col=mix(col, u_color, dot(col,vec3(.21,.71,.07)));

  col=mix(vec3(.08),col,min(time*.1,1.));
  col=clamp(col,.08,1.);
  O=vec4(col,1);
}`;

const VERTEX_SHADER = `#version 300 es
precision highp float;
in vec4 position;
void main(){ gl_Position = position; }`;

// ─── Renderer ─────────────────────────────────────────────────────────────────

class SmokeRenderer {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private color: [number, number, number] = [0.42, 0.08, 0.1]; // burgundy default

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    if (!this.gl) return;
    this.setup();
    this.init();
  }

  updateColor(color: [number, number, number]) {
    this.color = color;
  }

  updateScale() {
    const dpr = Math.max(1, window.devicePixelRatio);
    this.canvas.width  = window.innerWidth  * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private compile(shader: WebGLShader, source: string) {
    const { gl } = this;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader error:", gl.getShaderInfoLog(shader));
    }
  }

  private setup() {
    const { gl } = this;
    this.vs = gl.createShader(gl.VERTEX_SHADER)!;
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    const program = gl.createProgram()!;
    this.compile(this.vs, VERTEX_SHADER);
    this.compile(this.fs, FRAGMENT_SHADER);
    this.program = program;
    gl.attachShader(program, this.vs);
    gl.attachShader(program, this.fs);
    gl.linkProgram(program);
  }

  private init() {
    const { gl, program } = this;
    if (!program) return;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    (program as unknown as Record<string, WebGLUniformLocation | null>)["resolution"] =
      gl.getUniformLocation(program, "resolution");
    (program as unknown as Record<string, WebGLUniformLocation | null>)["time"] =
      gl.getUniformLocation(program, "time");
    (program as unknown as Record<string, WebGLUniformLocation | null>)["u_color"] =
      gl.getUniformLocation(program, "u_color");
  }

  render(now = 0) {
    const { gl, program, buffer, canvas, color } = this;
    if (!program || !gl.isProgram(program)) return;
    const p = program as unknown as Record<string, WebGLUniformLocation | null>;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f(p["resolution"]!, canvas.width, canvas.height);
    gl.uniform1f(p["time"]!,       now * 1e-3);
    gl.uniform3fv(p["u_color"]!,   color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy() {
    const { gl, program, vs, fs } = this;
    if (!program) return;
    if (vs) { gl.detachShader(program, vs); gl.deleteShader(vs); }
    if (fs) { gl.detachShader(program, fs); gl.deleteShader(fs); }
    gl.deleteProgram(program);
    this.program = null;
  }
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r
    ? [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255]
    : null;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SmokeBackgroundProps {
  /** Color hex que tiñe el humo. Default: burgundy Springs #6B1419 */
  smokeColor?: string;
  className?: string;
}

export function SmokeBackground({
  smokeColor = "#6B1419",
  className = "",
}: SmokeBackgroundProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rendRef    = useRef<SmokeRenderer | null>(null);
  const rafRef     = useRef<number>(0);

  // Inicialización y loop de render
  useEffect(() => {
    if (!canvasRef.current) return;

    // Respeta prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas   = canvasRef.current;
    const renderer = new SmokeRenderer(canvas);
    rendRef.current = renderer;

    const onResize = () => renderer.updateScale();
    onResize();
    window.addEventListener("resize", onResize);

    const loop = (now: number) => {
      renderer.render(now);
      rafRef.current = requestAnimationFrame(loop);
    };
    loop(0);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.destroy();
    };
  }, []);

  // Actualizar color cuando cambia el prop
  useEffect(() => {
    const rgb = hexToRgb(smokeColor);
    if (rgb && rendRef.current) rendRef.current.updateColor(rgb);
  }, [smokeColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      aria-hidden="true"
    />
  );
}
