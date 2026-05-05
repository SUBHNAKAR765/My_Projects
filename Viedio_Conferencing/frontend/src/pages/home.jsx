import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { AuthContext } from '../contexts/AuthContext';
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);
    const [newMeetCode, setNewMeetCode] = useState('');
    const [showNewMeet, setShowNewMeet] = useState(false);
    const { addToUserHistory } = useContext(AuthContext);

    const handleCreateMeeting = async () => {
        const code = crypto.randomUUID().slice(0, 16);
        setNewMeetCode(code);
        setShowNewMeet(true);
        await addToUserHistory(code);
    }

    const handleStartNewMeeting = () => {
        navigate(`/${newMeetCode}`);
    }

    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    }

    const handleShare = () => {
        if (!meetingCode.trim()) return;
        navigator.clipboard.writeText(`${window.location.origin}/${meetingCode}`);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    }

    return (
        <div className="homeWrapper">
            {/* Animated background blobs */}
            <div className="blob blob1" />
            <div className="blob blob2" />
            <div className="blob blob3" />

            {/* Navbar */}
            <nav className="homeNav">
                <div className="homeNavBrand">
                    <span>APNA CONNECT</span>
                </div>
                <div className="homeNavActions">
                    <button className="navBtn historyBtn" onClick={() => navigate("/history")}>
                        <RestoreIcon sx={{ fontSize: 40 }} />
                        History
                    </button>
                    <button className="navBtn logoutBtn" onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/auth");
                    }}>
                        <LogoutIcon sx={{ fontSize: 40 }} />
                        Logout
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <main className="homeMain">
                <div className="homeHero">
                    <div className="homeBadge">✦ HD Video &bull; Zero Lag &bull; Secure</div>
                    <h1 className="homeTitle">
                        Connect with anyone,<br />
                        <span className="homeGradientText">anywhere, instantly.</span>
                    </h1>
                    <p className="homeSubtitle">
                        Enter a meeting code to jump straight into a crystal-clear video call.
                    </p>

                    {/* New Meeting Modal */}
                    {showNewMeet && (
                        <div className="newMeetBanner">
                            <div className="newMeetInfo">
                                <span className="newMeetLabel">Your meeting code</span>
                                <span className="newMeetCode">{newMeetCode}</span>
                            </div>
                            <div className="newMeetActions">
                                <button className="newMeetCopyBtn" onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/${newMeetCode}`);
                                    setCopySuccess(true);
                                    setTimeout(() => setCopySuccess(false), 2000);
                                }}>
                                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                                    {copySuccess ? 'Copied!' : 'Copy Link'}
                                </button>
                                <button className="newMeetStartBtn" onClick={handleStartNewMeeting}>
                                    Start Meeting
                                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="joinCard">
                        <div className="joinCardInner">
                            <label className="joinLabel">Join a Meeting</label>
                            <div className="joinInputRow">
                                <input
                                    className="joinInput"
                                    placeholder="e.g. abc-defg-hij"
                                    value={meetingCode}
                                    onChange={e => setMeetingCode(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleJoinVideoCall()}
                                />
                                <button className="joinBtn" onClick={handleJoinVideoCall}>
                                    Join Now
                                    <ArrowForwardIcon sx={{ fontSize: 20 }} />
                                </button>
                                <button className="shareBtn" onClick={handleShare} title="Copy meeting link">
                                    <ContentCopyIcon sx={{ fontSize: 20 }} />
                                    {copySuccess ? 'Copied!' : 'Share'}
                                </button>
                            </div>
                            <div className="joinDivider">
                                <span>or</span>
                            </div>
                            <button className="createMeetBtn" onClick={handleCreateMeeting}>
                                + New Meeting
                            </button>
                        </div>
                    </div>

                    <div className="homeStats">
                        <div className="statItem"><span className="statNum">10K+</span><span className="statLabel">Active Users</span></div>
                        <div className="statDivider" />
                        <div className="statItem"><span className="statNum">99.9%</span><span className="statLabel">Uptime</span></div>
                        <div className="statDivider" />
                        <div className="statItem"><span className="statNum">E2E</span><span className="statLabel">Encrypted</span></div>
                    </div>
                </div>

                <div className="homeImagePanel">
                    <div className="imageGlow" />
                    <img src='/logo3.png' alt="Video call illustration" className="homeImage" />
                </div>
            </main>
        </div>
    )
}

export default withAuth(HomeComponent)