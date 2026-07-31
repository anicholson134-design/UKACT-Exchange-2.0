'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  startDate: string // 'YYYY-MM-DD' or ''
  endDate: string
  onChange: (start: string, end: string) => void
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Single-month calendar: click a start day, then an end day — the range between highlights. */
export function DateRangeCalendar({ startDate, endDate, onChange }: Props) {
  const start = startDate ? parseISO(startDate) : null
  const end = endDate ? parseISO(endDate) : null

  const [viewMonth, setViewMonth] = useState(() => {
    const base = start ?? new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const today = startOfToday()

  function handleClickDay(day: Date) {
    if (day < today) return
    if (!start || (start && end)) {
      onChange(toISO(day), '')
    } else if (day < start) {
      onChange(toISO(day), toISO(start))
    } else {
      onChange(toISO(start), toISO(day))
    }
  }

  function changeMonth(delta: number) {
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  // Monday-first weekday index
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="rounded-xl border border-input bg-background p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => changeMonth(-1)} className="p-1.5 rounded-md hover:bg-muted transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold">
          {viewMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </span>
        <button type="button" onClick={() => changeMonth(1)} className="p-1.5 rounded-md hover:bg-muted transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-[11px] font-medium text-muted-foreground py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />

          const iso = toISO(day)
          const isStart = start && iso === toISO(start)
          const isEnd = end && iso === toISO(end)
          const inRange = start && end && day > start && day < end
          const isPast = day < today

          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => handleClickDay(day)}
              className={`h-8 text-xs rounded-md transition-colors ${
                isStart || isEnd
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : inRange
                  ? 'bg-primary/15 text-foreground'
                  : isPast
                  ? 'text-muted-foreground/30 cursor-not-allowed'
                  : 'hover:bg-muted'
              }`}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>

      {start && (
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          {end ? (
            <>{start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</>
          ) : (
            'Pick an end date…'
          )}
        </p>
      )}
    </div>
  )
}
