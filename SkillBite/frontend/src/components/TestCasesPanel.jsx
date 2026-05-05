import { useMemo, useState } from 'react'

function normalize(s) {
  return (s ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd()
}

function diffOk(a, b) {
  return normalize(a) === normalize(b)
}

export default function TestCasesPanel({
  inputFields = [],
  defaultCases = [],
  onRunCase,
  running,
  activeResult,
}) {
  const [cases, setCases] = useState(() => defaultCases.length ? defaultCases : [
    { id: 'case1', name: 'Case 1', inputFields: {}, expectedOutput: '', isCustom: false },
  ])
  const [activeId, setActiveId] = useState(cases[0]?.id)

  const activeCase = useMemo(() => cases.find(c => c.id === activeId) || cases[0], [cases, activeId])
  const activeIndex = useMemo(() => Math.max(0, cases.findIndex(c => c.id === activeId)), [cases, activeId])

  function updateField(name, value) {
    setCases(prev => prev.map(c => c.id === activeId
      ? { ...c, inputFields: { ...(c.inputFields || {}), [name]: value } }
      : c
    ))
  }

  function updateExpected(value) {
    setCases(prev => prev.map(c => c.id === activeId ? { ...c, expectedOutput: value } : c))
  }

  function reset() {
    setCases(defaultCases.length ? defaultCases : [{ id: 'case1', name: 'Case 1', inputFields: {}, expectedOutput: '', isCustom: false }])
    setActiveId((defaultCases[0]?.id) || 'case1')
  }

  function addCustom() {
    const id = `custom_${Date.now()}`
    const next = { id, name: 'Custom', inputFields: {}, expectedOutput: '', isCustom: true }
    setCases(prev => [...prev, next])
    setActiveId(id)
  }

  const comparison = useMemo(() => {
    const expected = activeCase?.expectedOutput ?? ''
    const actual = activeResult?.stdout ?? ''
    return {
      expected,
      actual,
      ok: diffOk(expected, actual),
    }
  }, [activeCase?.expectedOutput, activeResult?.stdout])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 border-b border-gray-800 bg-[#111111] shrink-0 overflow-x-auto">
        {cases.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              c.id === activeId ? 'border-b-2 border-blue-500 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {c.name}
          </button>
        ))}
        <button
          onClick={addCustom}
          className="px-3 py-2 text-xs text-gray-400 hover:text-white whitespace-nowrap"
        >
          + Custom
        </button>
        <div className="flex-1" />
        <button onClick={reset} className="px-3 py-2 text-xs text-gray-500 hover:text-gray-300 whitespace-nowrap">
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {inputFields?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {inputFields.map((f) => (
              <label key={f.name} className="text-xs text-gray-500">
                <span className="text-gray-400 font-semibold">{f.name}</span>
                <span className="text-gray-600 ml-1">{f.type ? `(${f.type})` : ''}</span>
                <textarea
                  value={(activeCase?.inputFields || {})[f.name] || ''}
                  onChange={(e) => updateField(f.name, e.target.value)}
                  rows={f.type?.includes('[]') ? 3 : 2}
                  placeholder={f.placeholder || ''}
                  className="mt-1 w-full bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 resize-none focus:outline-none focus:border-blue-500"
                />
              </label>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-600">This problem doesn’t define named inputs. Use the editor’s sample input format.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="text-xs text-gray-500">
            Expected Output
            <textarea
              value={activeCase?.expectedOutput || ''}
              onChange={(e) => updateExpected(e.target.value)}
              rows={4}
              className="mt-1 w-full bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 resize-none focus:outline-none focus:border-blue-500"
            />
          </label>
          <div className="text-xs text-gray-500">
            Your Output
            <pre className={`mt-1 w-full min-h-[96px] bg-gray-900/60 border rounded-lg p-3 text-xs font-mono whitespace-pre-wrap ${
              activeResult ? (comparison.ok ? 'border-green-800 text-green-300' : 'border-red-800 text-red-300') : 'border-gray-800 text-gray-300'
            }`}>
              {activeResult?.stdout ?? ''}
            </pre>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRunCase?.(activeCase, activeIndex)}
            disabled={running}
            className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] border border-gray-700 rounded text-xs font-semibold disabled:opacity-40"
          >
            Run this case
          </button>
          {activeResult && (
            <span className={`text-xs font-semibold ${comparison.ok ? 'text-green-400' : 'text-red-400'}`}>
              {comparison.ok ? 'Matches expected output' : 'Output mismatch'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

