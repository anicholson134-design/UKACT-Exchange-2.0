const BEST_KEY = 'keep-wheelbarrow:best'
const SETTINGS_KEY = 'keep-wheelbarrow:settings'
const LEADERBOARD_KEY = 'keep-wheelbarrow:leaderboard'

export interface LeaderboardEntry {
  score: number
  itemsStacked: number
  date: string
}

export interface GameSettings {
  muted: boolean
  reducedMotion: boolean
  scanlines: boolean
}

const DEFAULT_SETTINGS: GameSettings = {
  muted: false,
  reducedMotion: false,
  scanlines: true,
}

export function getHighScore(): number {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(BEST_KEY)
  const n = raw ? parseInt(raw, 10) : 0
  return Number.isFinite(n) ? n : 0
}

export function setHighScore(score: number) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(BEST_KEY, String(score))
}

export function getSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function setSettings(settings: GameSettings) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LEADERBOARD_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Adds a run to the local leaderboard, keeping the top 5 scores. */
export function addToLeaderboard(entry: LeaderboardEntry): LeaderboardEntry[] {
  const list = [...getLeaderboard(), entry].sort((a, b) => b.score - a.score).slice(0, 5)
  if (typeof window !== 'undefined') window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list))
  return list
}
