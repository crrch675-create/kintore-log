import { useEffect, useMemo, useState } from 'react'
import { loadWorkouts, saveWorkouts } from './storage'
import type { WorkoutEntry } from './types'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(() => loadWorkouts())

  useEffect(() => {
    saveWorkouts(workouts)
  }, [workouts])

  const addWorkouts = (entries: WorkoutEntry[]) => {
    setWorkouts((prev) => [...[...entries].reverse(), ...prev])
  }

  const updateWorkout = (entry: WorkoutEntry) => {
    setWorkouts((prev) => prev.map((w) => (w.id === entry.id ? entry : w)))
  }

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id))
  }

  const exerciseNames = useMemo(() => {
    const names = new Set(workouts.map((w) => w.exerciseName))
    return Array.from(names).sort((a, b) => a.localeCompare(b, 'ja'))
  }, [workouts])

  return { workouts, addWorkouts, updateWorkout, deleteWorkout, exerciseNames }
}
