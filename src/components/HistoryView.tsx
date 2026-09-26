import { useState } from 'react'
import type { WorkoutEntry } from '../types'
import { CalendarView } from './CalendarView'
import { WorkoutList } from './WorkoutList'

type Props = {
  workouts: WorkoutEntry[]
  onUpdate: (entry: WorkoutEntry) => void
  onDelete: (id: string) => void
}

type View = 'calendar' | 'list'

export function HistoryView({ workouts, onUpdate, onDelete }: Props) {
  const [view, setView] = useState<View>('calendar')

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {(
          [
            { id: 'calendar', label: 'カレンダー' },
            { id: 'list', label: 'リスト' },
          ] as const
        ).map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              view === v.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'calendar' ? (
        <CalendarView workouts={workouts} onUpdate={onUpdate} onDelete={onDelete} />
      ) : (
        <WorkoutList workouts={workouts} onUpdate={onUpdate} onDelete={onDelete} />
      )}
    </div>
  )
}
