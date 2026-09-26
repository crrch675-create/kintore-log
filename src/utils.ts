import { v4 as uuid } from 'uuid'
import type { ExerciseBlockValue, SetEntry, WorkoutEntry } from './types'

export function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayString(): string {
  return dateKey(new Date())
}

export function formatDateJp(date: string): string {
  const [y, m, d] = date.split('-')
  return `${y}年${Number(m)}月${Number(d)}日`
}

export function totalVolume(entry: WorkoutEntry): number {
  return entry.sets.reduce((sum, s) => sum + s.weight * s.reps, 0)
}

export function maxWeight(entry: WorkoutEntry): number {
  return entry.sets.reduce((max, s) => Math.max(max, s.weight), 0)
}

export function emptySet(): SetEntry {
  return { id: uuid(), weight: 0, reps: 0 }
}

export function emptyExerciseBlock(): ExerciseBlockValue {
  return { id: uuid(), exerciseName: '', sets: [emptySet()], memo: '' }
}

export function groupByDate(workouts: WorkoutEntry[]): Map<string, WorkoutEntry[]> {
  const byDate = new Map<string, WorkoutEntry[]>()
  for (const w of workouts) {
    const list = byDate.get(w.date) ?? []
    list.push(w)
    byDate.set(w.date, list)
  }
  return byDate
}

export type CalendarCell = { date: Date; dateKey: string; inCurrentMonth: boolean }

export function buildMonthGrid(year: number, month: number): CalendarCell[][] {
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const rows = Math.ceil((startWeekday + daysInMonth) / 7)
  const gridStart = new Date(year, month, 1 - startWeekday)

  const weeks: CalendarCell[][] = []
  for (let w = 0; w < rows; w++) {
    const week: CalendarCell[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(gridStart)
      date.setDate(gridStart.getDate() + w * 7 + d)
      week.push({ date, dateKey: dateKey(date), inCurrentMonth: date.getMonth() === month })
    }
    weeks.push(week)
  }
  return weeks
}

export function formatMonthJp(year: number, month: number): string {
  return `${year}年${month + 1}月`
}
