import { useMemo } from 'react'
import type { WorkoutEntry } from '../types'
import { formatDateJp, groupByDate } from '../utils'
import { DayEntryList } from './DayEntryList'

type Props = {
  workouts: WorkoutEntry[]
  onUpdate: (entry: WorkoutEntry) => void
  onDelete: (id: string) => void
}

export function WorkoutList({ workouts, onUpdate, onDelete }: Props) {
  const groups = useMemo(() => {
    return Array.from(groupByDate(workouts).entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [workouts])

  if (workouts.length === 0) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-slate-400 shadow-sm">
        まだ記録がありません。「記録する」タブから最初のトレーニングを追加しましょう。
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map(([date, entries]) => (
        <div key={date}>
          <h3 className="mb-2 text-sm font-semibold text-slate-500">{formatDateJp(date)}</h3>
          <DayEntryList entries={entries} onUpdate={onUpdate} onDelete={onDelete} />
        </div>
      ))}
    </div>
  )
}
