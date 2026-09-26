import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ExerciseBlockValue, WorkoutEntry } from '../types'
import { emptyExerciseBlock, todayString } from '../utils'
import { ExerciseFields } from './ExerciseFields'

type Props = {
  onSubmit: (entries: WorkoutEntry[]) => void
}

export function RecordForm({ onSubmit }: Props) {
  const [date, setDate] = useState(todayString())
  const [exercises, setExercises] = useState<ExerciseBlockValue[]>([emptyExerciseBlock()])

  const updateExercise = (id: string, next: ExerciseBlockValue) => {
    setExercises((prev) => prev.map((ex) => (ex.id === id ? next : ex)))
  }

  const addExercise = () => setExercises((prev) => [...prev, emptyExerciseBlock()])
  const removeExercise = (id: string) =>
    setExercises((prev) => (prev.length > 1 ? prev.filter((ex) => ex.id !== id) : prev))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const entries: WorkoutEntry[] = exercises
      .filter((ex) => ex.exerciseName.trim())
      .map((ex) => ({
        id: ex.id,
        date,
        exerciseName: ex.exerciseName.trim(),
        sets: ex.sets.filter((s) => s.weight > 0 || s.reps > 0),
        memo: ex.memo.trim() || undefined,
      }))
      .filter((entry) => entry.sets.length > 0)

    if (entries.length === 0) return
    onSubmit(entries)
    setExercises([emptyExerciseBlock()])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">日付</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-auto"
          />
        </label>
      </div>

      {exercises.map((exercise, index) => (
        <div key={exercise.id} className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-500">種目 {index + 1}</p>
          <ExerciseFields
            value={exercise}
            onChange={(next) => updateExercise(exercise.id, next)}
            onRemove={exercises.length > 1 ? () => removeExercise(exercise.id) : undefined}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addExercise}
        className="w-full rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
      >
        + 種目を追加
      </button>

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
      >
        記録する
      </button>
    </form>
  )
}
