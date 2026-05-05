export const VERDICT_META = {
  AC:            { label: 'Accepted',           color: 'text-green-400',  bg: 'bg-green-900/30 border-green-800' },
  WA:            { label: 'Wrong Answer',        color: 'text-red-400',    bg: 'bg-red-900/30 border-red-800' },
  TLE:           { label: 'Time Limit Exceeded', color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-800' },
  RE:            { label: 'Runtime Error',       color: 'text-orange-400', bg: 'bg-orange-900/30 border-orange-800' },
  COMPILE_ERROR: { label: 'Compile Error',       color: 'text-pink-400',   bg: 'bg-pink-900/30 border-pink-800' },
}

export default function VerdictBadge({ verdict }) {
  const m = VERDICT_META[verdict] || { label: verdict, color: 'text-gray-400', bg: 'bg-gray-800 border-gray-700' }
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${m.bg} ${m.color}`}>
      {m.label}
    </span>
  )
}
