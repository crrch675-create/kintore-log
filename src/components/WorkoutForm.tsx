import { useState } from 'react'
import type { FormEvent } from 'react'
import { v4 as uuid } from 'uuid'
import type { SetEntry, WorkoutEntry } from '../types'
import { todayString } from '../utils'

type Props = {
  exerciseNames: string[]
  onSubmit: (entry: WorkoutEntry) => void
  initial?: WorkoutEntry
  onCancel?: () => void
}

function emptySet(): SetEntry {
  return { id: uuid(), weight: 0, reps: 0 }
}

export function WorkoutForm({ exerciseNames, onSubmit, initial, onCancel }: Props) {
  const [date, setDate] = useState(initial?.date ?? todayString())
  const [exerciseName, setExerciseName] = useState(initial?.exerciseName ?? '')
  const [sets, setSets] = useState<SetEntry[]>(initial?.sets ?? [emptySet()])
  const [memo, setMemo] = useState(initial?.memo ?? '')

  const updateSet = (id: string, field: 'weight' | 'reps', value: number) => {
    setSets((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const addSet = () => setSets((prev) => [...prev, emptySet()])
  const removeSet = (id: string) =>
    setSets((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!exerciseName.trim()) return
    const entry: WorkoutEntry = {
      id: initial?.id ?? uuid(),
      date,
      exerciseName: exerciseName.trim(),
      sets: sets.filter((s) => s.weight > 0 || s.reps > 0),
      memo: memo.trim() || undefined,
    }
    if (entry.sets.length === 0) return
    onSubmit(entry)
    if (!initial) {
      setExerciseName('')
      setSets([emptySet()])
      setMemo('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">日付</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">種目名</span>
          <input
            type="text"
            list="exercise-names"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="例: ベンチプレス"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <datalist id="exercise-names">
            {exerciseNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-600">セット</span>
        <div className="space-y-2">
          {sets.map((set, index) => (
            <div key={set.id} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-sm text-slate-400">{index + 1}</span>
              <input
                type="number"
                min={0}
                step={0.5}
                value={set.weight || ''}
                onChange={(e) => updateSet(set.id, 'weight', Number(e.target.value))}
                placeholder="重量"
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-500">kg ×</span>
              <input
                type="number"
                min={0}
                step={1}
                value={set.reps || ''}
                onChange={(e) => updateSet(set.id, 'reps', Number(e.target.value))}
                placeholder="回数"
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-500">回</span>
              <button
                type="button"
                onClick={() => removeSet(set.id)}
                disabled={sets.length <= 1}
                className="ml-auto rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-100 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="セットを削除"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSet}
          className="mt-2 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
        >
          + セットを追加
        </button>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-600">メモ (任意)</span>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="フォームの気付き、コンディションなど"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          {initial ? '更新する' : '記録する'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
