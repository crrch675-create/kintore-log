import type { WorkoutEntry } from './types'

const STORAGE_KEY = 'kintore-log:workouts'

export function loadWorkouts(): WorkoutEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveWorkouts(workouts: WorkoutEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts))
  } catch {
    // localStorageが使えない環境(プライベートモード等)では記録を諦める
  }
}
