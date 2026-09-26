export type SetEntry = {
  id: string
  weight: number
  reps: number
}

export type WorkoutEntry = {
  id: string
  date: string // YYYY-MM-DD
  exerciseName: string
  sets: SetEntry[]
  memo?: string
}
