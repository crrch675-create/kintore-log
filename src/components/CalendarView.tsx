import { useMemo, useState } from 'react'
import type { BodyPart } from '../exerciseCatalog'
import { BODY_PART_DOT_COLOR, BODY_PARTS, findBodyPartForExercise } from '../exerciseCatalog'
import type { WorkoutEntry } from '../types'
import { buildMonthGrid, formatDateJp, formatMonthJp, groupByDate, todayString } from '../utils'
import { DayEntryList } from './DayEntryList'

type Props = {
  workouts: WorkoutEntry[]
  onUpdate: (entry: WorkoutEntry) => void
  onDelete: (id: string) => void
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function bodyPartsOf(entries: WorkoutEntry[]): BodyPart[] {
  const parts = new Set<BodyPart>()
  for (const entry of entries) {
    const part = findBodyPartForExercise(entry.exerciseName)
    if (part) parts.add(part)
  }
  return Array.from(parts)
}

export function CalendarView({ workouts, onUpdate, onDelete }: Props) {
  const today = new Date()
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedDate, setSelectedDate] = useState(todayString())
  const [bodyPartFilter, setBodyPartFilter] = useState<BodyPart | 'all'>('all')

  const byDate = useMemo(() => groupByDate(workouts), [workouts])
  const weeks = useMemo(
    () => buildMonthGrid(viewDate.year, viewDate.month),
    [viewDate.year, viewDate.month],
  )

  const shiftMonth = (delta: number) => {
    const d = new Date(viewDate.year, viewDate.month + delta, 1)
    setViewDate({ year: d.getFullYear(), month: d.getMonth() })
  }

  const lastRecord = useMemo(() => {
    if (bodyPartFilter === 'all') return undefined
    const matching = workouts.filter(
      (w) => findBodyPartForExercise(w.exerciseName) === bodyPartFilter,
    )
    if (matching.length === 0) return undefined
    const latestDate = matching.reduce((max, w) => (w.date > max ? w.date : max), matching[0].date)
    return { date: latestDate, entries: matching.filter((w) => w.date === latestDate) }
  }, [workouts, bodyPartFilter])

  const jumpToDate = (dateStr: string) => {
    const [y, m] = dateStr.split('-').map(Number)
    setViewDate({ year: y, month: m - 1 })
    setSelectedDate(dateStr)
  }

  const selectedEntries = byDate.get(selectedDate) ?? []

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">部位で絞り込み</span>
          <select
            value={bodyPartFilter}
            onChange={(e) => setBodyPartFilter(e.target.value as BodyPart | 'all')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">全て</option>
            {BODY_PARTS.map((part) => (
              <option key={part} value={part}>
                {part}
              </option>
            ))}
          </select>
        </label>

        {bodyPartFilter !== 'all' &&
          (lastRecord ? (
            <button
              type="button"
              onClick={() => jumpToDate(lastRecord.date)}
              className="mt-3 block w-full rounded-lg bg-indigo-50 p-3 text-left hover:bg-indigo-100"
            >
              <p className="text-xs font-medium text-indigo-500">
                {bodyPartFilter}の前回 ・ {formatDateJp(lastRecord.date)}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {lastRecord.entries
                  .map(
                    (e) => `${e.exerciseName} ${e.sets.map((s) => `${s.weight}kg×${s.reps}回`).join('、')}`,
                  )
                  .join(' / ')}
              </p>
            </button>
          ) : (
            <p className="mt-3 text-sm text-slate-400">{bodyPartFilter}の記録はまだありません。</p>
          ))}
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-lg px-3 py-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="前の月"
          >
            ←
          </button>
          <p className="font-semibold text-slate-800">
            {formatMonthJp(viewDate.year, viewDate.month)}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-lg px-3 py-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="次の月"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
          {WEEKDAY_LABELS.map((label, i) => (
            <div
              key={label}
              className={i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : undefined}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {weeks.flat().map((cell) => {
            const entries = byDate.get(cell.dateKey) ?? []
            const parts = bodyPartsOf(entries)
            const dots =
              bodyPartFilter === 'all' ? parts : parts.filter((p) => p === bodyPartFilter)
            const matchesFilter = bodyPartFilter === 'all' || dots.length > 0
            const isSelected = cell.dateKey === selectedDate
            const isToday = cell.dateKey === todayString()

            return (
              <button
                key={cell.dateKey}
                type="button"
                onClick={() => setSelectedDate(cell.dateKey)}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : isToday
                      ? 'bg-indigo-50 text-indigo-600'
                      : cell.inCurrentMonth
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cell.date.getDate()}</span>
                <span className="flex h-1.5 gap-0.5">
                  {entries.length > 0 && matchesFilter
                    ? dots
                        .slice(0, 3)
                        .map((part, i) => (
                          <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSelected ? 'bg-white' : BODY_PART_DOT_COLOR[part]
                            }`}
                          />
                        ))
                    : null}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-500">{formatDateJp(selectedDate)}</h3>
        {selectedEntries.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-center text-slate-400 shadow-sm">
            この日の記録はありません。
          </p>
        ) : (
          <DayEntryList entries={selectedEntries} onUpdate={onUpdate} onDelete={onDelete} />
        )}
      </div>
    </div>
  )
}
