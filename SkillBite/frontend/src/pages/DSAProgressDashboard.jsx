import { useState, useMemo } from 'react'
import { CheckCircle2, Circle, RotateCcw, Bookmark, ChevronDown, ChevronUp } from 'lucide-react'

const CATEGORIES = [
  { key: 'arrays',        label: 'Arrays',              total: 40, easy: 15, medium: 18, hard: 7 },
  { key: 'strings',       label: 'Strings',             total: 30, easy: 12, medium: 13, hard: 5 },
  { key: 'linked-list',   label: 'Linked List',         total: 25, easy: 8,  medium: 12, hard: 5 },
  { key: 'trees',         label: 'Trees',               total: 45, easy: 12, medium: 22, hard: 11 },
  { key: 'graphs',        label: 'Graphs',              total: 40, easy: 8,  medium: 20, hard: 12 },
  { key: 'dp',            label: 'Dynamic Programming', total: 60, easy: 10, medium: 28, hard: 22 },
  { key: 'sorting',       label: 'Sorting',             total: 20, easy: 8,  medium: 9,  hard: 3 },
  { key: 'binary-search', label: 'Binary Search',       total: 30, easy: 10, medium: 14, hard: 6 },
  { key: 'two-pointers',  label: 'Two Pointers',        total: 25, easy: 10, medium: 12, hard: 3 },
  { key: 'backtracking',  label: 'Backtracking',        total: 30, easy: 5,  medium: 15, hard: 10 },
  { key: 'heap',          label: 'Heap / Priority Queue',total: 25, easy: 6, medium: 13, hard: 6 },
  { key: 'trie',          label: 'Trie',                total: 15, easy: 4,  medium: 8,  hard: 3 },
  { key: 'greedy',        label: 'Greedy',              total: 30, easy: 10, medium: 14, hard: 6 },
  { key: 'bit-manip',     label: 'Bit Manipulation',    total: 20, easy: 8,  medium: 9,  hard: 3 },
  { key: 'math',          label: 'Math & Number Theory',total: 19, easy: 8,  medium: 8,  hard: 3 },
]

const TOTAL_PROBLEMS = CATEGORIES.reduce((s, c) => s + c.total, 0)

const STATUS_KEY = 'skillbite_dsa_status'   // { [problemKey]: 'solved'|'attempted'|'revision' }
const NOTES_KEY  = 'skillbite_dsa_notes'    // { [problemKey]: string }

function loadStatus() { try { return JSON.parse(localStorage.getItem(STATUS_KEY) || '{}') } catch { return {} } }
function saveStatus(s) { localStorage.setItem(STATUS_KEY, JSON.stringify(s)) }
function loadNotes()  { try { return JSON.parse(localStorage.getItem(NOTES_KEY)  || '{}') } catch { return {} } }
function saveNotes(n) { localStorage.setItem(NOTES_KEY, JSON.stringify(n)) }

function buildProblems(cat) {
  const problems = []
  for (let i = 0; i < cat.easy;   i++) problems.push({ key: `${cat.key}_e${i}`, title: `${cat.label} Easy #${i+1}`,   diff: 'Easy' })
  for (let i = 0; i < cat.medium; i++) problems.push({ key: `${cat.key}_m${i}`, title: `${cat.label} Medium #${i+1}`, diff: 'Medium' })
  for (let i = 0; i < cat.hard;   i++) problems.push({ key: `${cat.key}_h${i}`, title: `${cat.label} Hard #${i+1}`,   diff: 'Hard' })
  return problems
}

const DIFF_COLOR = { Easy: 'text-green-400', Medium: 'text-yellow-400', Hard: 'text-red-400' }

export default function DSAProgressDashboard() {
  const [status, setStatus]       = useState(loadStatus)
  const [notes, setNotes]         = useState(loadNotes)
  const [activeTab, setActiveTab] = useState('progress')   // 'progress' | 'revision'
  const [expanded, setExpanded]   = useState({})
  const [editNote, setEditNote]   = useState(null)          // problemKey being edited
  const [noteText, setNoteText]   = useState('')

  const solved   = useMemo(() => Object.values(status).filter(v => v === 'solved').length,   [status])
  const attempted = useMemo(() => Object.values(status).filter(v => v === 'attempted').length, [status])
  const revision = useMemo(() => Object.keys(status).filter(k => status[k] === 'revision'),  [status])

  const easySolved   = useMemo(() => {
    const allEasy = CATEGORIES.flatMap(c => buildProblems(c).filter(p => p.diff === 'Easy').map(p => p.key))
    return allEasy.filter(k => status[k] === 'solved').length
  }, [status])
  const medSolved  = useMemo(() => {
    const all = CATEGORIES.flatMap(c => buildProblems(c).filter(p => p.diff === 'Medium').map(p => p.key))
    return all.filter(k => status[k] === 'solved').length
  }, [status])
  const hardSolved = useMemo(() => {
    const all = CATEGORIES.flatMap(c => buildProblems(c).filter(p => p.diff === 'Hard').map(p => p.key))
    return all.filter(k => status[k] === 'solved').length
  }, [status])

  const totalEasy   = CATEGORIES.reduce((s, c) => s + c.easy,   0)
  const totalMedium = CATEGORIES.reduce((s, c) => s + c.medium, 0)
  const totalHard   = CATEGORIES.reduce((s, c) => s + c.hard,   0)

  function setProblStatus(key, val) {
    const next = { ...status, [key]: val }
    if (val === status[key]) { delete next[key] }
    setStatus(next)
    saveStatus(next)
  }

  function saveNote(key) {
    const next = { ...notes, [key]: noteText }
    setNotes(next)
    saveNotes(next)
    setEditNote(null)
  }

  function toggleExpand(key) {
    setExpanded(e => ({ ...e, [key]: !e[key] }))
  }

  const revisionProblems = useMemo(() =>
    CATEGORIES.flatMap(c => buildProblems(c)).filter(p => status[p.key] === 'revision'),
  [status])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">DSA Progress Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Track your journey — inspired by TakeUForward A2Z Sheet</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Solved" value={`${solved}/${TOTAL_PROBLEMS}`} color="text-blue-400" pct={solved/TOTAL_PROBLEMS} />
        <StatCard label="Easy"   value={`${easySolved}/${totalEasy}`}   color="text-green-400"  pct={easySolved/totalEasy} />
        <StatCard label="Medium" value={`${medSolved}/${totalMedium}`}  color="text-yellow-400" pct={medSolved/totalMedium} />
        <StatCard label="Hard"   value={`${hardSolved}/${totalHard}`}   color="text-red-400"    pct={hardSolved/totalHard} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-4">
        {['progress', 'revision'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm capitalize transition-colors ${activeTab === t
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-gray-500 hover:text-gray-300'}`}>
            {t === 'revision' ? `Revision (${revision.length})` : 'Progress'}
          </button>
        ))}
      </div>

      {/* Progress tab */}
      {activeTab === 'progress' && (
        <div className="space-y-3">
          {CATEGORIES.map(cat => {
            const problems = buildProblems(cat)
            const catSolved = problems.filter(p => status[p.key] === 'solved').length
            const pct = catSolved / cat.total
            const isOpen = expanded[cat.key]
            return (
              <div key={cat.key} className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
                <button onClick={() => toggleExpand(cat.key)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-medium text-sm text-white truncate">{cat.label}</span>
                    <span className="text-xs text-gray-500 shrink-0">{catSolved}/{cat.total}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct*100}%` }} />
                    </div>
                    {isOpen ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-800 divide-y divide-gray-800/50">
                    {problems.map(p => (
                      <div key={p.key} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/20">
                        {/* Status toggle */}
                        <button onClick={() => setProblStatus(p.key, status[p.key] === 'solved' ? null : 'solved')}
                          className="shrink-0">
                          {status[p.key] === 'solved'
                            ? <CheckCircle2 size={16} className="text-green-400" />
                            : <Circle size={16} className="text-gray-600" />}
                        </button>

                        <span className={`text-xs font-medium shrink-0 ${DIFF_COLOR[p.diff]}`}>{p.diff}</span>
                        <span className="text-sm text-gray-300 flex-1 truncate">{p.title}</span>

                        {/* Attempted badge */}
                        <button onClick={() => setProblStatus(p.key, status[p.key] === 'attempted' ? null : 'attempted')}
                          className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors shrink-0 ${
                            status[p.key] === 'attempted'
                              ? 'border-yellow-700 text-yellow-400 bg-yellow-900/20'
                              : 'border-gray-700 text-gray-600 hover:text-gray-400'}`}>
                          Tried
                        </button>

                        {/* Revision star */}
                        <button onClick={() => setProblStatus(p.key, status[p.key] === 'revision' ? null : 'revision')}
                          className="shrink-0">
                          <Bookmark size={14} className={status[p.key] === 'revision' ? 'text-orange-400' : 'text-gray-700 hover:text-gray-500'} />
                        </button>

                        {/* Note */}
                        <button onClick={() => { setEditNote(p.key); setNoteText(notes[p.key] || '') }}
                          className={`text-[10px] shrink-0 ${notes[p.key] ? 'text-blue-400' : 'text-gray-700 hover:text-gray-500'}`}>
                          📝
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Revision tab */}
      {activeTab === 'revision' && (
        <div className="space-y-2">
          {revisionProblems.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-12">
              No problems marked for revision yet.<br />
              <span className="text-gray-600">Click the 🔖 icon on any problem to add it here.</span>
            </p>
          )}
          {revisionProblems.map(p => (
            <div key={p.key} className="flex items-center gap-3 bg-gray-900/60 border border-orange-900/30 rounded-xl px-4 py-3">
              <RotateCcw size={14} className="text-orange-400 shrink-0" />
              <span className={`text-xs font-medium shrink-0 ${DIFF_COLOR[p.diff]}`}>{p.diff}</span>
              <span className="text-sm text-gray-300 flex-1">{p.title}</span>
              <button onClick={() => setProblStatus(p.key, 'solved')}
                className="text-xs text-green-400 hover:text-green-300 border border-green-800 px-2 py-0.5 rounded">
                Mark Solved
              </button>
              <button onClick={() => setProblStatus(p.key, null)}
                className="text-xs text-gray-600 hover:text-gray-400">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Note modal */}
      {editNote && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-full max-w-md">
            <h3 className="font-semibold text-white mb-3 text-sm">Personal Note</h3>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={5}
              placeholder="Write your approach, key insight, or reminder..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 resize-none focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => saveNote(editNote)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 rounded-lg font-medium">
                Save
              </button>
              <button onClick={() => setEditNote(null)}
                className="px-4 text-gray-400 hover:text-white text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color, pct }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(pct||0)*100}%`, background: 'currentColor' }} />
      </div>
    </div>
  )
}
