// Bruit simplex 3D — Ian McEwan, Ashima Arts (licence MIT).
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/**
 * Sculpture : sphère déformée par deux octaves de bruit, normales recalculées
 * par différences finies pour un rendu « métal liquide ».
 */
export const sculptureVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uAmp;
varying vec3 vNormalW;
varying vec3 vPosW;
varying float vDisp;
${noise}

float field(vec3 p){
  float t = uTime;
  vec3 q = p * 0.62 + vec3(uMouse * 0.3, 0.0);
  float n = snoise(q + vec3(0.0, t * 0.1, t * 0.06)) * 0.3;
  n += snoise(p * 1.45 - vec3(t * 0.16, 0.0, t * 0.12)) * 0.06;
  return n * uAmp;
}

vec3 displace(vec3 p){
  vec3 n = normalize(p);
  return p + n * field(p);
}

void main(){
  vec3 p = position;
  vec3 n = normalize(p);
  vec3 tangent = normalize(cross(n, abs(n.y) > 0.99 ? vec3(1.0,0.0,0.0) : vec3(0.0,1.0,0.0)));
  vec3 bitangent = normalize(cross(n, tangent));
  float e = 0.012;
  vec3 d0 = displace(p);
  vec3 d1 = displace(p + tangent * e);
  vec3 d2 = displace(p + bitangent * e);
  vec3 dn = normalize(cross(d1 - d0, d2 - d0));
  if (dot(dn, n) < 0.0) dn = -dn;
  vDisp = field(p);
  vec4 world = modelMatrix * vec4(d0, 1.0);
  vPosW = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * dn);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const sculptureFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec3 uAccent;
uniform vec3 uSteel;
varying vec3 vNormalW;
varying vec3 vPosW;
varying float vDisp;

// Studio virtuel : bandes lumineuses qui se reflètent dans le métal
vec3 studio(vec3 r){
  float top = smoothstep(0.5, 1.0, r.y) * 1.25;
  float strip = smoothstep(0.09, 0.0, abs(r.y - 0.12 - 0.05 * sin(r.x * 2.0 + uTime * 0.15))) * 0.55;
  float side = smoothstep(0.45, 1.0, r.x) * smoothstep(-0.7, 0.5, r.y);
  float back = smoothstep(0.7, 1.0, -r.x) * 0.25;
  float floorBounce = smoothstep(-0.2, -1.0, r.y) * 0.06;
  vec3 c = vec3(0.012);
  c += vec3(1.0) * top;
  c += vec3(0.95, 0.97, 1.0) * strip;
  c += uAccent * side * 0.55 + vec3(0.82, 0.86, 1.0) * side * 0.55;
  c += uSteel * back;
  c += uAccent * floorBounce;
  return c;
}

void main(){
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  vec3 R = reflect(-V, N);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);

  vec3 env = studio(R);
  vec3 base = vec3(0.035, 0.036, 0.04);
  vec3 col = base + env * mix(vec3(0.38, 0.4, 0.46), vec3(1.0), fres);
  // Creux dorés : la matière révèle l'or dans ses replis
  float cavity = smoothstep(0.05, -0.32, vDisp);
  col += uAccent * cavity * 0.1 * (0.4 + fres);
  col += uAccent * fres * 0.4;

  // Tonemapping doux + gamma
  col = col / (col + vec3(0.85));
  col = pow(col, vec3(1.0 / 2.2));
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Champ de particules : poussière lumineuse en orbite lente. */
export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
attribute float aSeed;
varying float vAlpha;
varying float vAccent;
void main(){
  vec3 p = position;
  float a = uTime * (0.02 + aSeed * 0.03);
  float c = cos(a), s = sin(a);
  p.xz = mat2(c, -s, s, c) * p.xz;
  p.y += sin(uTime * 0.3 + aSeed * 6.28) * 0.08;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (8.0 / -mv.z);
  vAlpha = (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 40.0))) * smoothstep(14.0, 4.0, -mv.z);
  vAccent = step(0.86, aSeed);
}
`;

export const particlesFragment = /* glsl */ `
precision mediump float;
uniform vec3 uAccent;
varying float vAlpha;
varying float vAccent;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.0, d);
  vec3 col = mix(vec3(0.78, 0.81, 0.87), uAccent, vAccent);
  gl_FragColor = vec4(col, a * vAlpha * 0.75);
}
`;
