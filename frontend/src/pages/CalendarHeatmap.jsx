import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Map, ListTodo } from 'lucide-react'

const STREAK_KEY    = 'skillbite_solve_dates'   // Set<YYYY-MM-DD>
const PLANNER_KEY   = 'skillbite_planner'        // { [YYYY-MM-DD]: string[] }

function loadDates()   { try { return new Set(JSON.parse(localStorage.getItem(STREAK_KEY)  || '[]')) } catch { return new Set() } }
function loadPlanner() { try { return JSON.parse(localStorage.getItem(PLANNER_KEY) || '{}') } catch { return {} } }
function savePlanner(p) { localStorage.setItem(PLANNER_KEY, JSON.stringify(p)) }

export function recordSolveToday() {
  const dates = loadDates()
  dates.add(new Date().toISOString().slice(0, 10))
  localStorage.setItem(STREAK_KEY, JSON.stringify([...dates]))
}

const ROADMAP = [
  { phase: '1', title: 'Foundations',       topics: ['Arrays', 'Strings', 'Math & Number Theory', 'Bit Manipulation'], color: 'border-green-700 text-green-400' },
  { phase: '2', title: 'Core DS',           topics: ['Linked List', 'Stack & Queue', 'Hashing', 'Two Pointers', 'Sliding Window'], color: 'border-blue-700 text-blue-400' },
  { phase: '3', title: 'Recursion & Search',topics: ['Recursion', 'Binary Search', 'Backtracking', 'Divide & Conquer'], color: 'border-purple-700 text-purple-400' },
  { phase: '4', title: 'Trees & Graphs',    topics: ['Binary Trees', 'BST', 'Heaps', 'Graphs (BFS/DFS)', 'Topological Sort', 'Union Find'], color: 'border-yellow-700 text-yellow-400' },
  { phase: '5', title: 'Advanced',          topics: ['Dynamic Programming', 'Greedy', 'Trie', 'Segment Tree', 'Shortest Paths'], color: 'border-red-700 text-red-400' },
]

function toKey(y, m, d) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function CalendarHeatmap() {
  const today = new Date()
  const [year, setYear]     = useState(today.getFullYear())
  const [month, setMonth]   = useState(today.getMonth())
  const [activeTab, setActiveTab] = useState('calendar')  // 'calendar' | 'roadmap' | 'planner'
  const [planner, setPlanner]     = useState(loadPlanner)
  const [selectedDay, setSelectedDay] = useState(null)
  const [taskInput, setTaskInput]     = useState('')

  const solveDates = useMemo(() => loadDates(), [])

  const daysInMonth  = getDaysInMonth(year, month)
  const firstDayOfWk = getFirstDayOfWeek(year, month)

  function prevMonth() {
    if (month === 0) { setYear(y => y-1); setMonth(11) }
    else setMonth(m => m-1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y+1); setMonth(0) }
    else setMonth(m => m+1)
  }

  function addTask(dayKey) {
    if (!taskInput.trim()) return
    const next = { ...planner, [dayKey]: [...(planner[dayKey] || []), taskInput.trim()] }
    setPlanner(next)
    savePlanner(next)
    setTaskInput('')
  }

  function removeTask(dayKey, idx) {
    const next = { ...planner, [dayKey]: planner[dayKey].filter((_, i) => i !== idx) }
    setPlanner(next)
    savePlanner(next)
  }

  // Streak calculation
  const streak = useMemo(() => {
    let count = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().slice(0, 10)
      if (!solveDates.has(key)) break
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  }, [solveDates])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 p-4 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendar & Roadmap</h1>
          <p className="text-gray-500 text-sm mt-0.5">🔥 Current streak: <span className="text-orange-400 font-bold">{streak} day{streak !== 1 ? 's' : ''}</span></p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-5">
        {[
          { key: 'calendar', icon: <CalendarDays size={14} />, label: 'Heatmap' },
          { key: 'planner',  icon: <ListTodo size={14} />,     label: 'Daily Planner' },
          { key: 'roadmap',  icon: <Map size={14} />,          label: 'Roadmap' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm transition-colors ${activeTab === t.key
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-gray-500 hover:text-gray-300'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Calendar Heatmap */}
      {activeTab === 'calendar' && (
        <div className="max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-800 rounded-lg"><ChevronLeft size={16} /></button>
            <span className="font-semibold text-white">{MONTHS[month]} {year}</span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-800 rounded-lg"><ChevronRight size={16} /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(d => <div key={d} className="text-center text-[10px] text-gray-600 font-medium">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWk }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const key = toKey(year, month, day)
              const solved = solveDates.has(key)
              const isToday = key === today.toISOString().slice(0, 10)
              const hasTask = (planner[key] || []).length > 0
              return (
                <button key={day} onClick={() => { setSelectedDay(key); setActiveTab('planner') }}
                  className={`aspect-square rounded-md text-xs font-medium flex items-center justify-center relative transition-all
                    ${solved ? 'bg-green-700 text-white' : 'bg-gray-800/60 text-gray-500 hover:bg-gray-700'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                  {day}
                  {hasTask && <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-orange-400 rounded-full" />}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-700 rounded-sm" /> Solved</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-800 rounded-sm" /> No activity</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-orange-400 rounded-full" /> Has tasks</div>
          </div>

          <div className="mt-5 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Activity Summary</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><p className="text-lg font-bold text-green-400">{solveDates.size}</p><p className="text-xs text-gray-500">Total Days</p></div>
              <div><p className="text-lg font-bold text-orange-400">{streak}</p><p className="text-xs text-gray-500">Streak</p></div>
              <div>
                <p className="text-lg font-bold text-blue-400">
                  {Array.from({ length: daysInMonth }, (_, i) => toKey(year, month, i+1)).filter(k => solveDates.has(k)).length}
                </p>
                <p className="text-xs text-gray-500">This Month</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Planner */}
      {activeTab === 'planner' && (
        <div className="max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-800 rounded-lg"><ChevronLeft size={16} /></button>
            <span className="font-semibold text-white">{MONTHS[month]} {year}</span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-800 rounded-lg"><ChevronRight size={16} /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(d => <div key={d} className="text-center text-[10px] text-gray-600 font-medium">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 mb-5">
            {Array.from({ length: firstDayOfWk }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const key = toKey(year, month, day)
              const isSelected = selectedDay === key
              const isToday = key === today.toISOString().slice(0, 10)
              const hasTask = (planner[key] || []).length > 0
              return (
                <button key={day} onClick={() => setSelectedDay(key)}
                  className={`aspect-square rounded-md text-xs font-medium flex items-center justify-center relative transition-all
                    ${isSelected ? 'bg-blue-600 text-white' : hasTask ? 'bg-orange-900/40 text-orange-300' : 'bg-gray-800/60 text-gray-500 hover:bg-gray-700'}
                    ${isToday && !isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                  {day}
                </button>
              )
            })}
          </div>

          {selectedDay && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-3">
                📅 {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <div className="space-y-1.5 mb-3">
                {(planner[selectedDay] || []).map((task, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-300 flex-1">{task}</span>
                    <button onClick={() => removeTask(selectedDay, i)} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
                  </div>
                ))}
                {!(planner[selectedDay] || []).length && (
                  <p className="text-xs text-gray-600 italic">No tasks planned for this day.</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  value={taskInput}
                  onChange={e => setTaskInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask(selectedDay)}
                  placeholder="Add a problem or task..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
                <button onClick={() => addTask(selectedDay)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium">
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="max-w-2xl space-y-4">
          {ROADMAP.map((phase, idx) => (
            <div key={phase.phase} className={`border rounded-xl p-4 ${phase.color.split(' ')[0]} bg-gray-900/40`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${phase.color}`}>
                  {phase.phase}
                </div>
                <h3 className={`font-bold text-base ${phase.color.split(' ')[1]}`}>{phase.title}</h3>
                {idx === 0 && <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">Start Here</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {phase.topics.map(t => (
                  <span key={t} className="text-xs bg-gray-800/80 border border-gray-700 text-gray-300 px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-600 text-center pt-2">Complete phases in order for the best learning outcome.</p>
        </div>
      )}
    </div>
  )
}
