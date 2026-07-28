/**
 * Tiny WebAudio-based 8-bit sound synth — no audio files required.
 * Must be created/resumed from a user gesture (browsers block autoplay).
 */
export class RetroAudio {
  private ctx: AudioContext | null = null
  private muted = false
  private musicNodes: { stop: () => void } | null = null
  private noiseBuffer: AudioBuffer | null = null

  setMuted(muted: boolean) {
    this.muted = muted
    if (muted) this.stopMusic()
  }

  isMuted() {
    return this.muted
  }

  /** Call from a click/tap/keydown handler to unlock audio on mobile browsers. */
  ensureContext() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctx()
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  private getNoiseBuffer(ctx: AudioContext) {
    if (this.noiseBuffer) return this.noiseBuffer
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    this.noiseBuffer = buffer
    return buffer
  }

  private tone(freq: number, duration: number, opts: { type?: OscillatorType; gain?: number; slideTo?: number; delay?: number } = {}) {
    if (this.muted) return
    const ctx = this.ensureContext()
    const t0 = ctx.currentTime + (opts.delay ?? 0)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = opts.type ?? 'square'
    osc.frequency.setValueAtTime(freq, t0)
    if (opts.slideTo) osc.frequency.linearRampToValueAtTime(opts.slideTo, t0 + duration)
    gain.gain.setValueAtTime(opts.gain ?? 0.15, t0)
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + duration + 0.02)
  }

  private noiseHit(duration: number, gainValue = 0.2, delay = 0) {
    if (this.muted) return
    const ctx = this.ensureContext()
    const t0 = ctx.currentTime + delay
    const src = ctx.createBufferSource()
    src.buffer = this.getNoiseBuffer(ctx)
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, t0)
    gain.gain.setValueAtTime(gainValue, t0)
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
    src.connect(filter).connect(gain).connect(ctx.destination)
    src.start(t0)
    src.stop(t0 + duration + 0.02)
  }

  drop() {
    this.tone(320, 0.09, { type: 'square', slideTo: 200, gain: 0.1 })
  }

  bounce() {
    this.noiseHit(0.08, 0.14)
    this.tone(180, 0.07, { type: 'triangle', gain: 0.12 })
  }

  wobble() {
    this.tone(140, 0.18, { type: 'sine', slideTo: 110, gain: 0.08 })
  }

  creak() {
    this.tone(90, 0.35, { type: 'sawtooth', slideTo: 60, gain: 0.06 })
  }

  point() {
    this.tone(660, 0.06, { type: 'square', gain: 0.1 })
    this.tone(880, 0.09, { type: 'square', gain: 0.1, delay: 0.06 })
  }

  rare() {
    ;[660, 880, 1046, 1318].forEach((f, i) => this.tone(f, 0.1, { type: 'square', gain: 0.11, delay: i * 0.07 }))
  }

  milestone() {
    ;[523, 659, 784].forEach((f, i) => this.tone(f, 0.12, { type: 'triangle', gain: 0.12, delay: i * 0.09 }))
  }

  gameOver() {
    ;[392, 349, 311, 261].forEach((f, i) => this.tone(f, 0.22, { type: 'square', gain: 0.12, delay: i * 0.16 }))
    this.noiseHit(0.3, 0.15, 0.5)
  }

  startMusic() {
    if (this.muted || this.musicNodes) return
    const ctx = this.ensureContext()
    const notes = [261, 293, 329, 261, 329, 392, 349, 293]
    let i = 0
    let stopped = false
    const stepMs = 320
    const playStep = () => {
      if (stopped) return
      const freq = notes[i % notes.length]
      this.rawTone(ctx, freq, stepMs / 1000, 0.045)
      i += 1
      timeoutId = window.setTimeout(playStep, stepMs)
    }
    let timeoutId = window.setTimeout(playStep, 0)
    this.musicNodes = {
      stop: () => {
        stopped = true
        window.clearTimeout(timeoutId)
      },
    }
  }

  stopMusic() {
    this.musicNodes?.stop()
    this.musicNodes = null
  }

  private rawTone(ctx: AudioContext, freq: number, duration: number, gainValue: number) {
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t0)
    gain.gain.setValueAtTime(gainValue, t0)
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + duration + 0.02)
  }
}
