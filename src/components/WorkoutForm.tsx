import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ExerciseBlockValue, WorkoutEntry } from '../types'
import { ExerciseFields } from './ExerciseFields'

type Props = {
  onSubmit: (entry: WorkoutEntry) => void
  initial: WorkoutEntry
  onCancel: () => void
}

export function WorkoutForm({ onSubmit, initial, onCancel }: Props) {
  const [date, setDate] = useState(initial.date)
  const [exercise, setExercise] = useState<ExerciseBlockValue>({
    id: initial.id,
    exerciseName: initial.exerciseName,
    sets: initial.sets,
    memo: initial.memo ?? '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!exercise.exerciseName.trim()) return
    const sets = exercise.sets.filter((s) => s.weight > 0 || s.reps > 0)
    if (sets.length === 0) return
    onSubmit({
      id: initial.id,
      date,
      exerciseName: exercise.exerciseName.trim(),
      sets,
      memo: exercise.memo.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
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

      <ExerciseFields value={exercise} onChange={setExercise} />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          更新する
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
