import { useState } from 'react'
import { ProgressChart } from './components/ProgressChart'
import { RecordForm } from './components/RecordForm'
import { WorkoutList } from './components/WorkoutList'
import { useWorkouts } from './useWorkouts'

type Tab = 'record' | 'history' | 'stats'

const TABS: { id: Tab; label: string }[] = [
  { id: 'record', label: '記録する' },
  { id: 'history', label: '履歴' },
  { id: 'stats', label: '統計' },
]

function App() {
  const { workouts, addWorkouts, updateWorkout, deleteWorkout, exerciseNames } = useWorkouts()
  const [tab, setTab] = useState<Tab>('record')

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <datalist id="exercise-names">
        {exerciseNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <h1 className="text-xl font-bold text-slate-800">💪 筋トレ記録</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <nav className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'record' && <RecordForm onSubmit={addWorkouts} />}
        {tab === 'history' && (
          <WorkoutList workouts={workouts} onUpdate={updateWorkout} onDelete={deleteWorkout} />
        )}
        {tab === 'stats' && <ProgressChart workouts={workouts} exerciseNames={exerciseNames} />}
      </main>
    </div>
  )
}

export default App
