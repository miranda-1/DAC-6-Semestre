// Som de lápis riscando, gerado na hora (não precisa de arquivo nem de internet).
// Vira um arquivo WAV e toca com <audio>, que funciona em todos os navegadores
// (o Web Audio é silenciado no iPhone quando a chave lateral está no silencioso).
const KEY = 'oficina-som'
const RATE = 22050
let last = 0
let clips: string[] | null = null

export function soundOn() {
  try {
    return localStorage.getItem(KEY) !== 'off'
  } catch {
    return true
  }
}

export function setSound(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off')
  } catch {
    /* ignora */
  }
}

// Ruído com "traços" (o volume sobe e desce como o lápis indo e voltando),
// filtrado para soar como grafite no papel.
function pencilSamples(seconds: number) {
  const n = Math.floor(RATE * seconds)
  const out = new Float32Array(n)
  const strokes = 5 + Math.random() * 3
  let low = 0
  let prev = 0
  let high = 0
  let peak = 0
  for (let i = 0; i < n; i++) {
    const t = i / n
    const stroke = Math.abs(Math.sin(t * Math.PI * strokes)) ** 0.6
    const noise = Math.random() * 2 - 1
    low += 0.75 * (noise - low) // tira o chiado muito agudo
    high = 0.82 * (high + low - prev) // tira os graves
    prev = low
    const fade = Math.min(1, t * 40) * (1 - t)
    out[i] = high * stroke * fade
    peak = Math.max(peak, Math.abs(out[i]))
  }
  for (let i = 0; i < n; i++) out[i] = (out[i] / peak) * 0.8
  return out
}

function toWavUrl(samples: Float32Array) {
  const buf = new ArrayBuffer(44 + samples.length * 2)
  const v = new DataView(buf)
  const text = (at: number, s: string) => [...s].forEach((c, i) => v.setUint8(at + i, c.charCodeAt(0)))
  text(0, 'RIFF')
  v.setUint32(4, 36 + samples.length * 2, true)
  text(8, 'WAVEfmt ')
  v.setUint32(16, 16, true)
  v.setUint16(20, 1, true) // PCM
  v.setUint16(22, 1, true) // mono
  v.setUint32(24, RATE, true)
  v.setUint32(28, RATE * 2, true)
  v.setUint16(32, 2, true)
  v.setUint16(34, 16, true)
  text(36, 'data')
  v.setUint32(40, samples.length * 2, true)
  samples.forEach((s, i) => v.setInt16(44 + i * 2, s * 0x7fff, true))
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }))
}

export function scribble(seconds = 0.6) {
  const now = performance.now()
  if (!soundOn() || now - last < 120) return
  last = now
  try {
    // 4 variações curtas e 2 longas, para não soar sempre igual
    clips ??= [0.5, 0.5, 0.55, 0.6, 0.8, 1.1].map((s) => toWavUrl(pencilSamples(s)))
    const options = seconds > 0.7 ? clips.slice(4) : clips.slice(0, 4)
    const audio = new Audio(options[Math.floor(Math.random() * options.length)])
    audio.volume = 1
    void audio.play().catch(() => {
      /* o navegador ainda não deixou tocar (falta um toque na página) */
    })
  } catch {
    /* navegador sem áudio */
  }
}
