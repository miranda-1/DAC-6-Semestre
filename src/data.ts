// Todas as opções da oficina e o estado do site da turma.

export type ThemeId = 'none' | 'games' | 'musica' | 'esportes' | 'filmes' | 'espaco'
export type ColorId = 'none' | 'roxo' | 'azul' | 'verde' | 'laranja' | 'escuro'
export type FontId = 'none' | 'moderna' | 'classica' | 'gamer' | 'manuscrita'
export type ButtonId = 'none' | 'arredondado' | 'quadrado' | 'contorno' | 'sombra'
export type MessageId = 'none' | 'm1' | 'm2' | 'm3' | 'custom'

export interface SiteState {
  theme: ThemeId
  title: string
  color: ColorId
  font: FontId
  button: ButtonId
  message: MessageId
  customMessage: string
}

export const INITIAL_STATE: SiteState = {
  theme: 'none',
  title: 'Meu site',
  color: 'none',
  font: 'none',
  button: 'none',
  message: 'none',
  customMessage: '',
}

export type Deco = 'pixels' | 'equalizer' | 'field' | 'filmstrip' | 'stars'

export interface Theme {
  id: Exclude<ThemeId, 'none'>
  label: string
  emoji: string // usado nos cartões de escolha da ferramenta
  logo: string // nome do ícone (ver src/icons.tsx)
  eyebrow: string
  tagline: string
  nav: string[]
  deco: Deco
  cards: { icon: string; title: string; text: string }[] // icon = nome do ícone
  titles: string[]
}

export const THEMES: Theme[] = [
  {
    id: 'games',
    label: 'Games',
    emoji: '🎮',
    logo: 'controle',
    eyebrow: 'Level 1 · Press start',
    tagline: 'Dicas, lançamentos e os jogos favoritos da turma.',
    nav: ['Jogos', 'Ranking', 'Dicas'],
    deco: 'pixels',
    cards: [
      { icon: 'trofeu', title: 'Ranking da turma', text: 'Quem zerou mais jogos este mês?' },
      { icon: 'joystick', title: 'Clássicos', text: 'Os jogos que marcaram gerações.' },
      { icon: 'raio', title: 'Lançamentos', text: 'O que vem por aí.' },
    ],
    titles: ['Universo Gamer', 'Zona Gamer', 'Game On!'],
  },
  {
    id: 'musica',
    label: 'Música',
    emoji: '🎧',
    logo: 'fone',
    eyebrow: 'Aperte o play',
    tagline: 'As playlists e os artistas que a turma não para de ouvir.',
    nav: ['Playlists', 'Artistas', 'Shows'],
    deco: 'equalizer',
    cards: [
      { icon: 'microfone', title: 'Artistas', text: 'Quem a turma está ouvindo.' },
      { icon: 'playlist', title: 'Playlists', text: 'Uma trilha sonora para cada momento.' },
      { icon: 'ondas', title: 'Lançamentos', text: 'Os sons novos da semana.' },
    ],
    titles: ['Som da Turma', 'Playlist Infinita', 'Volume Máximo'],
  },
  {
    id: 'esportes',
    label: 'Esportes',
    emoji: '⚽',
    logo: 'medalha',
    eyebrow: 'Bola rolando',
    tagline: 'Resultados, jogadas incríveis e os times da turma.',
    nav: ['Times', 'Jogos', 'Tabela'],
    deco: 'field',
    cards: [
      { icon: 'trofeu', title: 'Campeonatos', text: 'Quem vai levar a taça?' },
      { icon: 'fogo', title: 'Jogadas', text: 'Os melhores lances da semana.' },
      { icon: 'grafico', title: 'Estatísticas', text: 'Os números por trás da vitória.' },
    ],
    titles: ['Arena da Turma', 'Placar Final', 'Time Campeão'],
  },
  {
    id: 'filmes',
    label: 'Filmes',
    emoji: '🎬',
    logo: 'claquete',
    eyebrow: 'Em cartaz',
    tagline: 'Críticas, estreias e os filmes favoritos da turma.',
    nav: ['Estreias', 'Críticas', 'Top 10'],
    deco: 'filmstrip',
    cards: [
      { icon: 'pipoca', title: 'Estreias', text: 'O que chega aos cinemas.' },
      { icon: 'estrela', title: 'Críticas', text: 'Vale ou não vale o ingresso?' },
      { icon: 'filme', title: 'Clássicos', text: 'Filmes que todo mundo deveria ver.' },
    ],
    titles: ['Cine Turma', 'Sessão da Tarde', 'Luz, Câmera, Ação'],
  },
  {
    id: 'espaco',
    label: 'Espaço',
    emoji: '🚀',
    logo: 'foguete',
    eyebrow: 'Missão 01',
    tagline: 'Planetas, estrelas e os mistérios do universo.',
    nav: ['Planetas', 'Missões', 'Galáxias'],
    deco: 'stars',
    cards: [
      { icon: 'orbita', title: 'Planetas', text: 'Um tour pelo Sistema Solar.' },
      { icon: 'brilho', title: 'Galáxias', text: 'Bilhões de estrelas por aí.' },
      { icon: 'satelite', title: 'Missões', text: 'Quem já foi (e quem vai) lá.' },
    ],
    titles: ['Rumo às Estrelas', 'Universo da Turma', 'Missão Espaço'],
  },
]

export interface Palette {
  id: Exclude<ColorId, 'none'>
  label: string
  bg: string
  surface: string
  text: string
  accent: string
  accent2: string // cor de destaque secundária (detalhes da arte e dos cartões)
  onAccent: string
}

export const PALETTES: Palette[] = [
  { id: 'roxo', label: 'Roxo', bg: '#F4F0FF', surface: '#FFFFFF', text: '#1E1240', accent: '#6C4DFF', accent2: '#FF5FA2', onAccent: '#FFFFFF' },
  { id: 'azul', label: 'Azul', bg: '#EBF3FF', surface: '#FFFFFF', text: '#0B1B3F', accent: '#2563EB', accent2: '#06B6D4', onAccent: '#FFFFFF' },
  { id: 'verde', label: 'Verde-água', bg: '#E6FAF5', surface: '#FFFFFF', text: '#053B36', accent: '#0D9488', accent2: '#F59E0B', onAccent: '#FFFFFF' },
  { id: 'laranja', label: 'Laranja', bg: '#FFF3EA', surface: '#FFFFFF', text: '#3A1A05', accent: '#EA580C', accent2: '#DB2777', onAccent: '#FFFFFF' },
  { id: 'escuro', label: 'Modo escuro', bg: '#0E0E16', surface: '#191926', text: '#F4F4F5', accent: '#A78BFA', accent2: '#22D3EE', onAccent: '#0F0F14' },
]

// Cores "sem CSS": o padrão do navegador.
export const DEFAULT_PALETTE: Omit<Palette, 'id' | 'label'> = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#000000',
  accent: '#000000',
  accent2: '#000000',
  onAccent: '#FFFFFF',
}

export interface FontOption {
  id: Exclude<FontId, 'none'>
  label: string
  family: string
  css: string
  scale: number // ajuste de tamanho, porque cada fonte "ocupa" espaço diferente
}

export const FONTS: FontOption[] = [
  { id: 'moderna', label: 'Moderna', family: "'Poppins', sans-serif", css: '"Poppins", sans-serif', scale: 1 },
  { id: 'classica', label: 'Clássica', family: "'Playfair Display', serif", css: '"Playfair Display", serif', scale: 1.05 },
  { id: 'gamer', label: 'Gamer', family: "'Press Start 2P', monospace", css: '"Press Start 2P", monospace', scale: 0.62 },
  { id: 'manuscrita', label: 'Escrita à mão', family: "'Caveat', cursive", css: '"Caveat", cursive', scale: 1.35 },
]

export const DEFAULT_FONT = "'Times New Roman', Times, serif"

export interface ButtonOption {
  id: Exclude<ButtonId, 'none'>
  label: string
}

export const BUTTONS: ButtonOption[] = [
  { id: 'arredondado', label: 'Arredondado' },
  { id: 'quadrado', label: 'Quadrado' },
  { id: 'contorno', label: 'Só contorno' },
  { id: 'sombra', label: 'Com sombra' },
]

export const MESSAGES: { id: Exclude<MessageId, 'none' | 'custom'>; text: string }[] = [
  { id: 'm1', text: 'Você também pode criar tecnologia!' },
  { id: 'm2', text: 'Bem-vindo ao site da turma!' },
  { id: 'm3', text: 'Clicou? Agora você é criador.' },
]

// ---------- helpers ----------

export const getTheme = (s: SiteState) => THEMES.find((t) => t.id === s.theme)
export const getPalette = (s: SiteState) => PALETTES.find((p) => p.id === s.color)
export const getFont = (s: SiteState) => FONTS.find((f) => f.id === s.font)

export function getMessage(s: SiteState): string | null {
  if (s.message === 'none') return null
  if (s.message === 'custom') return s.customMessage.trim() || '...'
  return MESSAGES.find((m) => m.id === s.message)!.text
}

export const displayTitle = (s: SiteState) => s.title.trim() || 'Meu site'
export const buttonLabel = (s: SiteState) => (s.theme === 'none' ? 'Clique aqui' : 'Explorar')
export const paragraph = (s: SiteState) => getTheme(s)?.tagline ?? 'Bem-vindo ao meu site.'

export interface ButtonStyle {
  background: string
  color: string
  borderRadius: string
  border: string
  boxShadow: string
}

export function buttonStyle(id: ButtonId, accent: string, onAccent: string, text: string): ButtonStyle | null {
  switch (id) {
    case 'arredondado':
      return { background: accent, color: onAccent, borderRadius: '999px', border: 'none', boxShadow: 'none' }
    case 'quadrado':
      return { background: accent, color: onAccent, borderRadius: '0px', border: 'none', boxShadow: 'none' }
    case 'contorno':
      return { background: 'transparent', color: accent, borderRadius: '10px', border: `3px solid ${accent}`, boxShadow: 'none' }
    case 'sombra':
      return { background: accent, color: onAccent, borderRadius: '12px', border: `2px solid ${text}`, boxShadow: `6px 6px 0 ${text}` }
    default:
      return null
  }
}

export function slug(title: string): string {
  const s = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return s || 'meu-site'
}

// Confere o que veio salvo no navegador: qualquer valor estranho (versão antiga,
// dado corrompido) volta para o padrão em vez de quebrar a página.
export function sanitizeState(raw: unknown): SiteState {
  const r = (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>
  const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
    allowed.includes(value as T) ? (value as T) : fallback
  const text = (value: unknown, fallback: string, max: number) => (typeof value === 'string' ? value.slice(0, max) : fallback)
  return {
    theme: pick(r.theme, ['none', ...THEMES.map((t) => t.id)], 'none'),
    title: text(r.title, INITIAL_STATE.title, 40),
    color: pick(r.color, ['none', ...PALETTES.map((p) => p.id)], 'none'),
    font: pick(r.font, ['none', ...FONTS.map((f) => f.id)], 'none'),
    button: pick(r.button, ['none', ...BUTTONS.map((b) => b.id)], 'none'),
    message: pick(r.message, ['none', 'custom', ...MESSAGES.map((m) => m.id)], 'none'),
    customMessage: text(r.customMessage, '', 70),
  }
}
