'use client'

import { useEffect, useState } from 'react'
import { GameCanvas, type GameOverResult } from './GameCanvas'
import { TitleScreen } from './TitleScreen'
import { HowToPlayModal } from './HowToPlayModal'
import { LeaderboardModal } from './LeaderboardModal'
import { GameOverScreen } from './GameOverScreen'
import { RetroAudio } from '@/lib/game/audio'
import {
  getHighScore,
  setHighScore,
  getSettings,
  setSettings,
  getLeaderboard,
  addToLeaderboard,
  type GameSettings,
  type LeaderboardEntry,
} from '@/lib/game/storage'

type Screen = 'title' | 'playing' | 'gameover'

export function WheelbarrowGame() {
  const [screen, setScreen] = useState<Screen>('title')
  const [howToOpen, setHowToOpen] = useState(false)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [settings, setSettingsState] = useState<GameSettings>({ muted: false, reducedMotion: false, scanlines: true })
  const [best, setBest] = useState(0)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [result, setResult] = useState<GameOverResult | null>(null)
  const [isNewBest, setIsNewBest] = useState(false)
  const [roundKey, setRoundKey] = useState(0)

  const [audio] = useState(() => new RetroAudio())

  useEffect(() => {
    const s = getSettings()
    setSettingsState(s)
    audio.setMuted(s.muted)
    setBest(getHighScore())
    setEntries(getLeaderboard())
  }, [audio])

  function updateSettings(next: GameSettings) {
    setSettingsState(next)
    setSettings(next)
    audio.setMuted(next.muted)
  }

  function handlePlay() {
    audio.ensureContext()
    audio.stopMusic()
    setRoundKey((k) => k + 1)
    setScreen('playing')
  }

  function handleGameOver(res: GameOverResult) {
    const beatBest = res.score > best
    setIsNewBest(beatBest)
    if (beatBest) {
      setBest(res.score)
      setHighScore(res.score)
    }
    setEntries(addToLeaderboard({ score: res.score, itemsStacked: res.itemsStacked, date: new Date().toISOString() }))
    setResult(res)
    setScreen('gameover')
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${settings.scanlines ? 'crt-scanlines' : ''}`}>
      {screen === 'title' && (
        <TitleScreen
          onPlay={handlePlay}
          onHowToPlay={() => setHowToOpen(true)}
          onLeaderboard={() => setLeaderboardOpen(true)}
          onToggleMute={() => updateSettings({ ...settings, muted: !settings.muted })}
          muted={settings.muted}
          reducedMotion={settings.reducedMotion}
          best={best}
        />
      )}

      {screen === 'playing' && (
        <GameCanvas
          key={roundKey}
          best={best}
          settings={settings}
          audio={audio}
          onGameOver={handleGameOver}
        />
      )}

      {screen === 'gameover' && result && (
        <GameOverScreen
          score={result.score}
          itemsStacked={result.itemsStacked}
          best={best}
          isNewBest={isNewBest}
          reducedMotion={settings.reducedMotion}
          onPlayAgain={handlePlay}
          onTitle={() => setScreen('title')}
        />
      )}

      {howToOpen && (
        <HowToPlayModal
          onClose={() => setHowToOpen(false)}
          settings={settings}
          onSettingsChange={updateSettings}
        />
      )}

      {leaderboardOpen && <LeaderboardModal entries={entries} onClose={() => setLeaderboardOpen(false)} />}
    </div>
  )
}
