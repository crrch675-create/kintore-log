import type { ExerciseBlockValue } from '../types'
import { emptySet } from '../utils'

type Props = {
  value: ExerciseBlockValue
  onChange: (value: ExerciseBlockValue) => void
  onRemove?: () => void
}

export function ExerciseFields({ value, onChange, onRemove }: Props) {
  const updateSet = (id: string, field: 'weight' | 'reps', num: number) => {
    onChange({
      ...value,
      sets: value.sets.map((s) => (s.id === id ? { ...s, [field]: num } : s)),
    })
  }

  const addSet = () => onChange({ ...value, sets: [...value.sets, emptySet()] })
  const removeSet = (id: string) =>
    onChange({
      ...value,
      sets: value.sets.length > 1 ? value.sets.filter((s) => s.id !== id) : value.sets,
    })

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <label className="block flex-1">
          <span className="mb-1 block text-sm font-medium text-slate-600">種目名</span>
          <input
            type="text"
            list="exercise-names"
            value={value.exerciseName}
            onChange={(e) => onChange({ ...value, exerciseName: e.target.value })}
            placeholder="例: ベンチプレス"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="mt-7 shrink-0 rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-100 hover:text-red-500"
            aria-label="この種目を削除"
          >
            ✕
          </button>
        )}
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-600">セット</span>
        <div className="space-y-2">
          {value.sets.map((set, index) => (
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
                disabled={value.sets.length <= 1}
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
          value={value.memo}
          onChange={(e) => onChange({ ...value, memo: e.target.value })}
          rows={2}
          placeholder="フォームの気付き、コンディションなど"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </label>
    </div>
  )
}
