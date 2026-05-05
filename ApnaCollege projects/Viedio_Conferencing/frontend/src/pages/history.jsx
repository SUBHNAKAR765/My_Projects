import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import VideocamIcon from '@mui/icons-material/Videocam'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PeopleIcon from '@mui/icons-material/People'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext)
    const [meetings, setMeetings] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetch = async () => {
            try {
                const history = await getHistoryOfUser()
                setMeetings(history)
            } catch (_) {}
            finally { setLoading(false) }
        }
        fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const formatDate = (d) => {
        const date = new Date(d)
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const formatTime = (d) => {
        return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }

    const formatDuration = (secs) => {
        if (!secs) return '—'
        const m = Math.floor(secs / 60)
        const s = secs % 60
        return m > 0 ? `${m}m ${s}s` : `${s}s`
    }

    return (
        <div className="historyPage">
            <div className="historyNav">
                <button className="historyBackBtn" onClick={() => navigate('/home')}>
                    <HomeIcon sx={{ fontSize: 20 }} /> Home
                </button>
                <h1 className="historyHeading">Meeting History</h1>
            </div>

            <div className="historyContent">
                {loading && <p className="historyEmpty">Loading...</p>}

                {!loading && meetings.length === 0 && (
                    <div className="historyEmptyState">
                        <VideocamIcon sx={{ fontSize: 52, color: '#334155' }} />
                        <p>No meetings yet</p>
                    </div>
                )}

                {!loading && meetings.length > 0 && (
                    <div className="historyList">
                        {meetings.map((m, i) => (
                            <div className="historyCard" key={i}>
                                <div className="historyCardLeft">
                                    <div className="historyCardIcon">
                                        <VideocamIcon sx={{ fontSize: 22, color: '#f0c070' }} />
                                    </div>
                                    <div className="historyCardInfo">
                                        <span className="historyCardCode">{m.meetingCode}</span>
                                        <div className="historyCardMeta">
                                            <span className="historyMetaItem">
                                                <CalendarTodayIcon sx={{ fontSize: 13 }} />
                                                {formatDate(m.date)} at {formatTime(m.date)}
                                            </span>
                                            <span className="historyMetaItem">
                                                <AccessTimeIcon sx={{ fontSize: 13 }} />
                                                {formatDuration(m.duration)}
                                            </span>
                                            <span className="historyMetaItem">
                                                <PeopleIcon sx={{ fontSize: 13 }} />
                                                {m.participants?.length > 0
                                                    ? `${m.participants.length} participant${m.participants.length > 1 ? 's' : ''}`
                                                    : 'No participants recorded'}
                                            </span>
                                        </div>
                                        {m.participants?.length > 0 && (
                                            <div className="historyParticipants">
                                                {m.participants.map((p, j) => (
                                                    <span className="historyParticipantChip" key={j}>{p}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button className="historyRejoinBtn" onClick={() => navigate(`/${m.meetingCode}`)}>
                                    Rejoin
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
