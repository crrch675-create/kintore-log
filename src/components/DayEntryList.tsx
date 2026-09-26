import { useState } from 'react'
import type { WorkoutEntry } from '../types'
import { totalVolume } from '../utils'
import { WorkoutForm } from './WorkoutForm'

type Props = {
  entries: WorkoutEntry[]
  onUpdate: (entry: WorkoutEntry) => void
  onDelete: (id: string) => void
}

export function DayEntryList({ entries, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {entries.map((entry) =>
        editingId === entry.id ? (
          <WorkoutForm
            key={entry.id}
            initial={entry}
            onCancel={() => setEditingId(null)}
            onSubmit={(updated) => {
              onUpdate(updated)
              setEditingId(null)
            }}
          />
        ) : (
          <div key={entry.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-800">{entry.exerciseName}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {entry.sets.map((s) => `${s.weight}kg×${s.reps}回`).join(' / ')}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  総重量 {totalVolume(entry).toLocaleString()} kg
                </p>
                {entry.memo && <p className="mt-2 text-sm text-slate-600">{entry.memo}</p>}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => setEditingId(entry.id)}
                  className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                >
                  編集
                </button>
                <button
                  onClick={() => {
                    if (confirm('この記録を削除しますか？')) onDelete(entry.id)
                  }}
                  className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-red-500"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  )
}
