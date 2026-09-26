import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BodyPart } from '../exerciseCatalog'
import { BODY_PARTS, findBodyPartForExercise } from '../exerciseCatalog'
import type { WorkoutEntry } from '../types'
import { maxWeight, totalVolume } from '../utils'

type Props = {
  workouts: WorkoutEntry[]
  exerciseNames: string[]
}

export function ProgressChart({ workouts, exerciseNames }: Props) {
  const [bodyPart, setBodyPart] = useState<BodyPart | 'all'>('all')
  const [selected, setSelected] = useState(exerciseNames[0] ?? '')

  const filteredExerciseNames = useMemo(
    () =>
      bodyPart === 'all'
        ? exerciseNames
        : exerciseNames.filter((name) => findBodyPartForExercise(name) === bodyPart),
    [exerciseNames, bodyPart],
  )

  const exercise = filteredExerciseNames.includes(selected) ? selected : filteredExerciseNames[0]

  const data = useMemo(() => {
    return workouts
      .filter((w) => w.exerciseName === exercise)
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map((w) => ({
        date: w.date.slice(5),
        最大重量: maxWeight(w),
        総重量: totalVolume(w),
      }))
  }, [workouts, exercise])

  if (exerciseNames.length === 0) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-slate-400 shadow-sm">
        記録が増えると、種目ごとの推移をグラフで確認できます。
      </p>
    )
  }

  return (
    <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">部位で絞り込み</span>
          <select
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value as BodyPart | 'all')}
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
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">種目を選択</span>
          <select
            value={exercise ?? ''}
            onChange={(e) => setSelected(e.target.value)}
            disabled={filteredExerciseNames.length === 0}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {filteredExerciseNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredExerciseNames.length === 0 ? (
        <p className="text-center text-slate-400">この部位の記録はまだありません。</p>
      ) : data.length === 0 ? (
        <p className="text-center text-slate-400">この種目の記録がありません。</p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="最大重量" stroke="#4f46e5" strokeWidth={2} dot />
              <Line type="monotone" dataKey="総重量" stroke="#f59e0b" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
