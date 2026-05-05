import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, Tooltip } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import PeopleIcon from '@mui/icons-material/People'
import ChatIcon from '@mui/icons-material/Chat'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GridViewIcon from '@mui/icons-material/GridView';
import PersonIcon from '@mui/icons-material/Person';
import PanToolIcon from '@mui/icons-material/PanTool';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(false);
    let [showParticipants, setShowParticipants] = useState(false);
    let [participants, setParticipants] = useState([]);
    let [chatWidth, setChatWidth] = useState(300);
    const isResizing = useRef(false);

    // Host detection
    const isHost = useRef(false);
    const [isHostState, setIsHostState] = useState(false);

    // Recording
    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingTimerRef = useRef(null);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);

    // Layout mode: 'grid' | 'spotlight'
    const [layout, setLayout] = useState('grid');
    const [spotlightId, setSpotlightId] = useState(null);

    // Raise hand
    const [handRaised, setHandRaised] = useState(false);
    const [raisedHands, setRaisedHands] = useState([]);

    // Force mute (host control)
    const [forceMuted, setForceMuted] = useState(false);

    // Waiting room
    const [waitingRoom, setWaitingRoom] = useState([]);
    const [showWaitingRoom, setShowWaitingRoom] = useState(false);
    const [inWaitingRoom, setInWaitingRoom] = useState(false);
    const [waitingHostName, setWaitingHostName] = useState('');

    // Toasts
    const [toasts, setToasts] = useState([]);
    const toastId = useRef(0);

    const showToast = (msg, type = 'info') => {
        const id = ++toastId.current;
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };

    // Play a soft beep using Web Audio API
    const playMessageSound = () => {
        try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        } catch (_) {}
    };
    const [copySuccess, setCopySuccess] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const meetingCode = window.location.pathname.replace('/', '');

    const formatRecTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const startRecording = () => {
        try {
            // ── 1. Collect all video elements on the page ──────────────────
            const allVideoEls = Array.from(document.querySelectorAll('video')).filter(v => v.srcObject && !v.paused);

            // ── 2. Build a composite canvas ────────────────────────────────
            const TILE_W = 640, TILE_H = 360;
            const cols = Math.ceil(Math.sqrt(allVideoEls.length || 1));
            const rows = Math.ceil((allVideoEls.length || 1) / cols);
            const canvas = Object.assign(document.createElement('canvas'), {
                width: TILE_W * cols,
                height: TILE_H * rows
            });
            canvasRef.current = canvas;
            const ctx = canvas.getContext('2d');

            const drawFrame = () => {
                ctx.fillStyle = '#010430';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                allVideoEls.forEach((v, i) => {
                    const col = i % cols, row = Math.floor(i / cols);
                    try { ctx.drawImage(v, col * TILE_W, row * TILE_H, TILE_W, TILE_H); } catch (_) {}
                    // name label
                    ctx.fillStyle = 'rgba(0,0,0,0.45)';
                    ctx.fillRect(col * TILE_W, row * TILE_H + TILE_H - 28, TILE_W, 28);
                    ctx.fillStyle = '#fff';
                    ctx.font = '16px sans-serif';
                    ctx.fillText(v.dataset.socket || 'local', col * TILE_W + 8, row * TILE_H + TILE_H - 8);
                });
                // REC indicator on canvas
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(16, 16, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px sans-serif';
                ctx.fillText('REC', 28, 21);
                animFrameRef.current = requestAnimationFrame(drawFrame);
            };
            drawFrame();

            // ── 3. Merge all audio streams ─────────────────────────────────
            const audioCtx = new AudioContext();
            const dest = audioCtx.createMediaStreamDestination();
            allVideoEls.forEach(v => {
                if (!v.srcObject) return;
                const audioTracks = v.srcObject.getAudioTracks();
                if (audioTracks.length === 0) return;
                try {
                    const src = audioCtx.createMediaStreamSource(new MediaStream(audioTracks));
                    src.connect(dest);
                } catch (_) {}
            });

            // ── 4. Combine canvas video + merged audio ─────────────────────
            const videoTrack = canvas.captureStream(30).getVideoTracks()[0];
            const combined = new MediaStream([videoTrack, ...dest.stream.getAudioTracks()]);

            // ── 5. Start MediaRecorder ─────────────────────────────────────
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
                ? 'video/webm;codecs=vp9,opus'
                : 'video/webm';
            recordedChunks.current = [];
            const recorder = new MediaRecorder(combined, { mimeType });
            recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.current.push(e.data); };
            recorder.onstop = () => {
                cancelAnimationFrame(animFrameRef.current);
                audioCtx.close();
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `meeting-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.webm`;
                a.click();
                URL.revokeObjectURL(url);
            };
            recorder.start(1000); // collect chunks every 1s
            mediaRecorderRef.current = recorder;

            // ── 6. Start timer ─────────────────────────────────────────────
            setRecordingTime(0);
            recordingTimerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
            setIsRecording(true);
        } catch (e) { console.error('Recording failed:', e); }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        clearInterval(recordingTimerRef.current);
        cancelAnimationFrame(animFrameRef.current);
        setIsRecording(false);
        setRecordingTime(0);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(meetingCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const startResize = (e) => {
        isResizing.current = true;
        document.addEventListener('mousemove', onResize);
        document.addEventListener('mouseup', stopResize);
    }
    const onResize = (e) => {
        if (!isResizing.current) return;
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 220 && newWidth <= 600) setChatWidth(newWidth);
    }
    const stopResize = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', onResize);
        document.removeEventListener('mouseup', stopResize);
    }

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);

    // Meeting timer
    const [meetingTime, setMeetingTime] = useState(0);
    const meetingTimerRef = useRef(null);

    const formatMeetTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return h > 0
            ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
            : `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!askForUsername) {
            meetingTimerRef.current = setInterval(() => setMeetingTime(t => t + 1), 1000);
        }
        return () => clearInterval(meetingTimerRef.current);
    }, [askForUsername]);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    let [lobbyVideo, setLobbyVideo] = useState(true);
    let [lobbyAudio, setLobbyAudio] = useState(true);

    const toggleLobbyVideo = () => {
        setLobbyVideo(prev => {
            if (window.localStream) {
                window.localStream.getVideoTracks().forEach(t => t.enabled = !prev);
            }
            return !prev;
        });
    }

    const toggleLobbyAudio = () => {
        setLobbyAudio(prev => {
            if (window.localStream) {
                window.localStream.getAudioTracks().forEach(t => t.enabled = !prev);
            }
            return !prev;
        });
    }

    // Stop lobby camera/mic the moment user joins the meeting
    useEffect(() => {
        if (!askForUsername) {
            if (localVideoref.current) {
                localVideoref.current.srcObject = null;
            }
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
                window.localStream = null;
            }
        }
    }, [askForUsername])

    useEffect(() => {
        getPermissions();
        return () => {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
                window.localStream = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            // Stop any existing stream first
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
                window.localStream = null;
            }

            // Request camera + mic together so browser prompts once
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            setVideoAvailable(true);
            setAudioAvailable(true);

            if (navigator.mediaDevices.getDisplayMedia) setScreenAvailable(true);
            else setScreenAvailable(false);

            window.localStream = stream;
            if (localVideoref.current) {
                localVideoref.current.srcObject = stream;
            }
        } catch (error) {
            // Try audio only if video fails
            try {
                const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true });
                setVideoAvailable(false);
                setAudioAvailable(true);
                window.localStream = audioOnly;
            } catch {
                setVideoAvailable(false);
                setAudioAvailable(false);
            }
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href, username)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                const left = participants.find(p => p.socketId === id);
                if (left) showToast(`${left.name} left the meeting`, 'leave');
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
                setParticipants(prev => prev.filter(p => p.socketId !== id))
            })

            socketRef.current.on('waiting-room', ({ hostName }) => {
                setInWaitingRoom(true);
                setWaitingHostName(hostName);
            })

            socketRef.current.on('waiting-room-update', (queue) => {
                setWaitingRoom(queue.map(w => ({ socketId: w.socketId, name: w.username })));
            })

            socketRef.current.on('denied-entry', () => {
                alert('The host has denied your request to join.');
                window.location.href = '/';
            })

            socketRef.current.on('you-are-host', () => {
                isHost.current = true;
                setIsHostState(true);
            })

            socketRef.current.on('hand-raised', (socketId, name) => {
                setRaisedHands(prev => {
                    if (prev.find(h => h.socketId === socketId)) return prev;
                    return [...prev, { socketId, name }];
                });
                showToast(`✋ ${name} raised their hand`, 'join');
            })

            socketRef.current.on('hand-lowered', (socketId) => {
                setRaisedHands(prev => prev.filter(h => h.socketId !== socketId));
            })

            socketRef.current.on('force-mute', () => {
                setAudio(false);
                setForceMuted(true);
                showToast('Host muted everyone', 'leave');
            })

            socketRef.current.on('force-unmute', () => {
                setForceMuted(false);
            })

            socketRef.current.on('user-joined', (id, clients, usernames) => {
                // Show join toast for newly joined user (not self)
                if (id !== socketIdRef.current && usernames) {
                    const joinedName = usernames[clients.indexOf(id)];
                    if (joinedName) showToast(`${joinedName} joined the meeting`, 'join');
                }
                // First client is the host
                if (clients[0] === socketIdRef.current) {
                    isHost.current = true;
                    setIsHostState(true);
                }
                setParticipants(clients.map((sid, i) => ({ socketId: sid, name: usernames ? usernames[i] : sid })))
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    const toggleHand = () => {
        if (!socketRef.current) return;
        if (handRaised) {
            socketRef.current.emit('lower-hand', username);
            setHandRaised(false);
        } else {
            socketRef.current.emit('raise-hand', username);
            setHandRaised(true);
        }
    };

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        if (forceMuted && !audio) return; // host has restricted unmuting
        setAudio(!audio);
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }



    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
            playMessageSound();
            showToast(`${sender}: ${data.length > 40 ? data.slice(0, 40) + '…' : data}`, 'message');
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }

    
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>
            {askForUsername === true ?

                <div className={styles.lobbyPage}>
                    {/* Left — video preview */}
                    <div className={styles.lobbyLeft}>
                        <div className={styles.lobbyVideoWrapper}>
                            <video ref={localVideoref} autoPlay muted className={styles.lobbyVideo}></video>
                            {!lobbyVideo && (
                                <div className={styles.lobbyVideoCover}>
                                    <VideocamOffIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                                    <span>Camera is off</span>
                                </div>
                            )}
                            <div className={styles.lobbyOverlayControls}>
                                <button
                                    className={`${styles.lobbyIconBtn} ${!lobbyAudio ? styles.lobbyIconBtnOff : ''}`}
                                    onClick={toggleLobbyAudio}
                                    title={lobbyAudio ? 'Turn off mic' : 'Turn on mic'}
                                >
                                    {lobbyAudio ? <MicIcon sx={{ fontSize: 22 }} /> : <MicOffIcon sx={{ fontSize: 22 }} />}
                                </button>
                                <button
                                    className={`${styles.lobbyIconBtn} ${!lobbyVideo ? styles.lobbyIconBtnOff : ''}`}
                                    onClick={toggleLobbyVideo}
                                    title={lobbyVideo ? 'Turn off camera' : 'Turn on camera'}
                                >
                                    {lobbyVideo ? <VideocamIcon sx={{ fontSize: 22 }} /> : <VideocamOffIcon sx={{ fontSize: 22 }} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right — join panel */}
                    <div className={styles.lobbyRight}>
                        <div className={styles.lobbyRightInner}>
                                <h1 className={styles.lobbyHeading}>Ready to join?</h1>
                                <p className={styles.lobbySubtext}>Enter your name to join the meeting</p>

                                <input
                                    className={styles.lobbyInput}
                                    placeholder="Enter your name"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && connect()}
                                />

                                <button className={styles.lobbyConnectBtn} onClick={connect}>
                                    Join Now
                                </button>
                        </div>
                    </div>
                </div> :


                <div className={styles.meetVideoContainer}>

                    {/* Guest Waiting Room Screen */}
                    {inWaitingRoom && (
                        <div className={styles.waitingScreenOverlay}>
                            <div className={styles.waitingScreenCard}>
                                <div className={styles.waitingSpinner} />
                                <h2 className={styles.waitingScreenTitle}>Waiting for host to let you in</h2>
                                <p className={styles.waitingScreenHost}>Host: <strong>{waitingHostName}</strong></p>
                                <p className={styles.waitingScreenSub}>Your request has been sent. Please wait...</p>
                                <button className={styles.waitingLeaveBtn} onClick={() => window.location.href = '/'}>Leave</button>
                            </div>
                        </div>
                    )}

                    {/* Waiting Room Panel — host only */}
                    {showWaitingRoom && isHostState && (
                        <div className={styles.waitingPanel}>
                            <h2 className={styles.waitingTitle}>Waiting Room</h2>
                            {waitingRoom.length === 0
                                ? <p className={styles.waitingEmpty}>No one is waiting</p>
                                : waitingRoom.map((p, i) => (
                                    <div key={i} className={styles.waitingItem}>
                                        <div className={styles.participantAvatar}>{p.name.charAt(0).toUpperCase()}</div>
                                        <span className={styles.waitingName}>{p.name}</span>
                                        <button className={styles.admitBtn} onClick={() => {
                                            socketRef.current.emit('admit-user', p.socketId);
                                            setWaitingRoom(prev => prev.filter(w => w.socketId !== p.socketId));
                                        }}>Admit</button>
                                        <button className={styles.denyBtn} onClick={() => {
                                            socketRef.current.emit('deny-user', p.socketId);
                                            setWaitingRoom(prev => prev.filter(w => w.socketId !== p.socketId));
                                        }}>Deny</button>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {/* Raised Hands Panel — host only */}
                    {isHostState && raisedHands.length > 0 && (
                        <div className={styles.raisedHandsPanel}>
                            <span className={styles.raisedHandsTitle}>✋ Raised Hands</span>
                            {raisedHands.map((h, i) => (
                                <div key={i} className={styles.raisedHandItem}>
                                    <div className={styles.participantAvatar}>{h.name.charAt(0).toUpperCase()}</div>
                                    <span className={styles.raisedHandName}>{h.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Share Meeting Code Modal */}
                    {showShareModal && (
                        <div className={styles.shareOverlay} onClick={() => setShowShareModal(false)}>
                            <div className={styles.shareModal} onClick={e => e.stopPropagation()}>
                                <h3 className={styles.shareTitle}>Share Meeting Code</h3>
                                <p className={styles.shareSubtext}>Share this code with people you want to invite</p>
                                <div className={styles.shareCodeBox}>
                                    <span className={styles.shareCode}>{meetingCode}</span>
                                    <button className={styles.shareCopyBtn} onClick={handleCopyCode}>
                                        <ContentCopyIcon sx={{ fontSize: 18 }} />
                                        {copySuccess ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className={styles.shareUrlBox}>
                                    <span className={styles.shareUrlText}>{window.location.href}</span>
                                </div>
                                <button className={styles.shareCopyUrlBtn} onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setCopySuccess(true);
                                    setTimeout(() => setCopySuccess(false), 2000);
                                }}>
                                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Chat Panel */}
                    {showModal && <div className={styles.chatRoom} style={{ width: chatWidth }}>
                        <div className={styles.chatResizeHandle} onMouseDown={startResize} />
                        <div className={styles.chatContainer}>
                            <div className={styles.chatHeader}>
                                <h2 className={styles.chatHeading}>Drop your message here</h2>
                            </div>
                            <div className={styles.chattingDisplay}>
                                {messages.length !== 0 ? messages.map((item, index) => (
                                    <div className={styles.chatMessage} key={index}>
                                        <span className={styles.chatSender}>{item.sender}</span>
                                        <p className={styles.chatText}>{item.data}</p>
                                    </div>
                                )) : <p className={styles.noMessages}>No messages yet</p>}
                            </div>
                            <div className={styles.chattingArea}>
                                <input
                                    className={styles.chatInput}
                                    placeholder="Enter your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button className={styles.chatSendBtn} onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                    </div>}

                    {/* Participants Panel */}
                    {showParticipants && <div className={styles.participantsPanel}>
                        <h2 className={styles.participantsTitle}>Participants ({participants.length + 1})</h2>
                        <ul className={styles.participantsList}>
                            {[{ name: username }, ...participants]
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((p, i) => (
                                    <li key={i} className={styles.participantItem}>
                                        <div className={styles.participantAvatar}>{p.name.charAt(0).toUpperCase()}</div>
                                        <span>{p.name}{p.name === username ? ' (You)' : ''}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>}

                    <div className={styles.buttonContainers}>
                        {/* Media controls */}
                        <Tooltip title={video ? 'Turn off camera' : 'Turn on camera'}>
                            <IconButton onClick={handleVideo} style={{ color: 'white', padding: '14px' }}>
                                {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={forceMuted ? 'Muted by host' : audio ? 'Mute' : 'Unmute'}>
                            <IconButton onClick={handleAudio} style={{ color: forceMuted ? '#ef4444' : 'white', padding: '14px' }}>
                                {audio === true ? <MicIcon /> : <MicOffIcon />}
                            </IconButton>
                        </Tooltip>
                        {screenAvailable &&
                            <Tooltip title={screen ? 'Stop sharing' : 'Share screen'}>
                                <IconButton onClick={handleScreen} style={{ color: 'white', padding: '14px' }}>
                                    {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                                </IconButton>
                            </Tooltip>
                        }

                        <div className={styles.toolbarDivider} />

                        {/* Panel toggles */}
                        <Badge badgeContent={newMessages} max={999} color='warning'>
                            <Tooltip title="Chat">
                                <IconButton onClick={() => { setModal(!showModal); setShowParticipants(false); setShowWaitingRoom(false); setNewMessages(0); }} style={{ color: 'white', padding: '14px' }}>
                                    <ChatIcon />
                                </IconButton>
                            </Tooltip>
                        </Badge>
                        <Tooltip title="Participants">
                            <IconButton onClick={() => { setShowParticipants(!showParticipants); setModal(false); setShowWaitingRoom(false); }} style={{ color: 'white', padding: '14px' }}>
                                <PeopleIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Share meeting code">
                            <IconButton onClick={() => setShowShareModal(true)} style={{ color: 'white', padding: '14px' }}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={layout === 'grid' ? 'Spotlight view' : 'Grid view'}>
                            <IconButton onClick={() => { setLayout(l => l === 'grid' ? 'spotlight' : 'grid'); setSpotlightId(null); }} style={{ color: 'white', padding: '14px' }}>
                                {layout === 'grid' ? <PersonIcon /> : <GridViewIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={handRaised ? 'Lower hand' : 'Raise hand'}>
                            <IconButton onClick={toggleHand} style={{ color: handRaised ? '#f0c070' : 'white', padding: '14px' }}>
                                <PanToolIcon />
                            </IconButton>
                        </Tooltip>

                        <div className={styles.toolbarDivider} />

                        {/* Host-only controls */}
                        {isHostState && (
                            <Tooltip title="Mute all participants">
                                <IconButton onClick={() => socketRef.current.emit('mute-all')}
                                    style={{ color: 'white', padding: '14px' }}>
                                    <VolumeOffIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {isHostState && (
                            <Tooltip title={isRecording ? 'Stop recording' : 'Start recording'}>
                                <IconButton onClick={isRecording ? stopRecording : startRecording}
                                    style={{ color: isRecording ? '#ef4444' : 'white', padding: '14px' }}>
                                    {isRecording ? <StopIcon /> : <FiberManualRecordIcon />}
                                </IconButton>
                            </Tooltip>
                        )}
                        {isHostState && (
                            <Tooltip title="Waiting room">
                                <Badge badgeContent={waitingRoom.length} color='warning'>
                                    <IconButton onClick={() => { setShowWaitingRoom(!showWaitingRoom); setModal(false); setShowParticipants(false); }} style={{ color: 'white', padding: '14px' }}>
                                        <PeopleIcon />
                                    </IconButton>
                                </Badge>
                            </Tooltip>
                        )}

                        <div className={styles.toolbarDivider} />

                        {/* End call */}
                        <Tooltip title="End call">
                            <IconButton onClick={handleEndCall} style={{ color: 'red', padding: '14px' }}>
                                <CallEndIcon />
                            </IconButton>
                        </Tooltip>
                    </div>


                    {/* Meeting timer */}
                    <div className={styles.meetingTimer}>
                        {formatMeetTime(meetingTime)}
                    </div>

                    {/* Recording indicator */}
                    {isRecording && (
                        <div className={styles.recordingBadge}>
                            <span className={styles.recordingDot} />
                            REC &nbsp;<span className={styles.recordingTimer}>{formatRecTime(recordingTime)}</span>
                            <button className={styles.recordingStopBtn} onClick={stopRecording}>■ Stop</button>
                        </div>
                    )}

                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                    {/* Toast notifications */}
                    <div className={styles.toastStack}>
                        {toasts.map(t => (
                            <div key={t.id} className={`${styles.toast} ${styles['toast_' + t.type]}`}>
                                {t.type === 'join' && '👋 '}
                                {t.type === 'leave' && '🚪 '}
                                {t.type === 'message' && '💬 '}
                                {t.msg}
                            </div>
                        ))}
                    </div>

                    <div className={layout === 'grid' ? styles.conferenceGrid : styles.conferenceSpotlight}>
                        {layout === 'spotlight' && (() => {
                            const activeId = spotlightId || videos[0]?.socketId;
                            const spotVideo = videos.find(v => v.socketId === activeId) || videos[0];
                            const thumbs = videos.filter(v => v.socketId !== activeId);
                            return (
                                <>
                                    {spotVideo && (
                                        <div className={styles.spotlightMain}>
                                            <video
                                                data-socket={spotVideo.socketId}
                                                ref={ref => { if (ref && spotVideo.stream) ref.srcObject = spotVideo.stream; }}
                                                autoPlay
                                                className={styles.spotlightMainVideo}
                                            />
                                            <span className={styles.videoNameLabel}>
                                                {participants.find(p => p.socketId === spotVideo.socketId)?.name || spotVideo.socketId}
                                            </span>
                                        </div>
                                    )}
                                    <div className={styles.spotlightThumbs}>
                                        {thumbs.map(v => (
                                            <div key={v.socketId} className={styles.spotlightThumb} onClick={() => setSpotlightId(v.socketId)}>
                                                <video
                                                    data-socket={v.socketId}
                                                    ref={ref => { if (ref && v.stream) ref.srcObject = v.stream; }}
                                                    autoPlay
                                                />
                                                <span className={styles.videoNameLabel}>
                                                    {participants.find(p => p.socketId === v.socketId)?.name || v.socketId}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            );
                        })()}
                        {layout === 'grid' && videos.map((v) => (
                            <div key={v.socketId} className={styles.gridTile} onClick={() => { setLayout('spotlight'); setSpotlightId(v.socketId); }}>
                                <video
                                    data-socket={v.socketId}
                                    ref={ref => { if (ref && v.stream) ref.srcObject = v.stream; }}
                                    autoPlay
                                />
                                <span className={styles.videoNameLabel}>
                                    {participants.find(p => p.socketId === v.socketId)?.name || v.socketId}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>

            }

        </div>
    )
}
