import type { WorkoutEntry } from './types'

export function todayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
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
