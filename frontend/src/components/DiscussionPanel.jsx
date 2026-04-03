import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { api } from '../utils/api'

export default function DiscussionPanel({ problemId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    if (!problemId) { setItems([]); setLoading(false); return }
    setLoading(true)
    api.getDiscussion(problemId)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [problemId])

  async function onPost() {
    if (!text.trim() || !problemId) return
    setPosting(true)
    try {
      const created = await api.postComment(problemId, text.trim())
      setItems(prev => [created, ...prev])
      setText('')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onPost()}
          placeholder="Add to discussion..."
          className="flex-1 bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={onPost}
          disabled={posting || !text.trim()}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium disabled:opacity-40 inline-flex items-center gap-1.5"
        >
          <Send size={14} /> Post
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading discussion...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-sm">No comments yet. Be the first to post.</div>
      ) : (
        <div className="space-y-2">
          {items.map((c) => (
            <div key={c.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300 truncate">{c.user}</span>
                <span className="text-[10px] text-gray-600 shrink-0">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

