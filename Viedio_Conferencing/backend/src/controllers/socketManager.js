import { Server } from "socket.io"

// room → { members: [socketId], host: socketId, waitingRoom: [{socketId, username}] }
let rooms = {}
let messages = {}
let timeOnline = {}
// socketId → { username, roomPath }
let socketMeta = {}

const getRoom = (path) => {
    if (!rooms[path]) rooms[path] = { members: [], host: null, waitingRoom: [], mutedAll: false }
    return rooms[path]
}

const findRoomBySocket = (socketId) => {
    return socketMeta[socketId]?.roomPath || null
}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"], allowedHeaders: ["*"], credentials: true }
    })

    io.on("connection", (socket) => {
        console.log("Connected:", socket.id)

        // ── Join Call ──────────────────────────────────────────────────────
        socket.on("join-call", (path, username) => {
            const room = getRoom(path)
            timeOnline[socket.id] = new Date()
            socketMeta[socket.id] = { username: username || socket.id, roomPath: path }

            // If room is empty → this user is the host, join directly
            if (room.members.length === 0) {
                room.host = socket.id
                room.members.push(socket.id)

                const usernames = room.members.map(id => socketMeta[id]?.username || id)
                room.members.forEach(id => {
                    io.to(id).emit("user-joined", socket.id, room.members, usernames, room.host)
                })

                // Send existing messages
                if (messages[path]) {
                    messages[path].forEach(m => {
                        io.to(socket.id).emit("chat-message", m.data, m.sender, m['socket-id-sender'])
                    })
                }
            } else {
                // Put in waiting room
                room.waitingRoom.push({ socketId: socket.id, username: username || socket.id })
                // Notify the user they are waiting
                io.to(socket.id).emit("waiting-room", {
                    hostName: socketMeta[room.host]?.username || "Host"
                })
                // Notify host
                io.to(room.host).emit("waiting-room-update", room.waitingRoom)
            }
        })

        // ── Admit User (host only) ─────────────────────────────────────────
        socket.on("admit-user", (waitingSocketId) => {
            const path = findRoomBySocket(socket.id)
            if (!path) return
            const room = getRoom(path)
            if (room.host !== socket.id) return // only host

            room.waitingRoom = room.waitingRoom.filter(w => w.socketId !== waitingSocketId)
            room.members.push(waitingSocketId)

            const usernames = room.members.map(id => socketMeta[id]?.username || id)
            room.members.forEach(id => {
                io.to(id).emit("user-joined", waitingSocketId, room.members, usernames, room.host)
            })

            // Send existing messages to admitted user
            if (messages[path]) {
                messages[path].forEach(m => {
                    io.to(waitingSocketId).emit("chat-message", m.data, m.sender, m['socket-id-sender'])
                })
            }

            io.to(room.host).emit("waiting-room-update", room.waitingRoom)
        })

        // ── Deny User (host only) ──────────────────────────────────────────
        socket.on("deny-user", (waitingSocketId) => {
            const path = findRoomBySocket(socket.id)
            if (!path) return
            const room = getRoom(path)
            if (room.host !== socket.id) return

            room.waitingRoom = room.waitingRoom.filter(w => w.socketId !== waitingSocketId)
            io.to(waitingSocketId).emit("denied-entry")
            io.to(room.host).emit("waiting-room-update", room.waitingRoom)
        })

        // ── Signal ────────────────────────────────────────────────────────
        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message)
        })

        // ── Chat Message ──────────────────────────────────────────────────
        socket.on("chat-message", (data, sender) => {
            const path = findRoomBySocket(socket.id)
            if (!path) return
            if (!messages[path]) messages[path] = []
            messages[path].push({ sender, data, 'socket-id-sender': socket.id })
            const room = getRoom(path)
            room.members.forEach(id => {
                io.to(id).emit("chat-message", data, sender, socket.id)
            })
        })

        // ── Raise Hand ────────────────────────────────────────────────────
        socket.on("raise-hand", (username) => {
            const path = findRoomBySocket(socket.id)
            if (!path) return
            const room = getRoom(path)
            room.members.forEach(id => {
                io.to(id).emit("hand-raised", socket.id, username)
            })
        })

        socket.on("lower-hand", (username) => {
            const path = findRoomBySocket(socket.id)
            if (!path) return
            const room = getRoom(path)
            room.members.forEach(id => {
                io.to(id).emit("hand-lowered", socket.id, username)
            })
        })

        // ── Mute All (host only) ──────────────────────────────────────────
        socket.on("mute-all", () => {
            const path = findRoomBySocket(socket.id)
            if (!path) return
            const room = getRoom(path)
            if (room.host !== socket.id) return
            room.mutedAll = true
            room.members.forEach(id => {
                if (id !== socket.id) io.to(id).emit("force-mute")
            })
        })

        socket.on("unmute-all", () => {
            const path = findRoomBySocket(socket.id)
            if (!path) return
            const room = getRoom(path)
            if (room.host !== socket.id) return
            room.mutedAll = false
            room.members.forEach(id => {
                if (id !== socket.id) io.to(id).emit("force-unmute")
            })
        })

        // ── Disconnect ────────────────────────────────────────────────────
        socket.on("disconnect", () => {
            const path = findRoomBySocket(socket.id)
            if (!path) { delete socketMeta[socket.id]; return }

            const room = getRoom(path)
            const diffTime = Math.abs(timeOnline[socket.id] - new Date())

            // Remove from waiting room if they were waiting
            room.waitingRoom = room.waitingRoom.filter(w => w.socketId !== socket.id)

            // Remove from members
            const idx = room.members.indexOf(socket.id)
            if (idx !== -1) {
                room.members.splice(idx, 1)
                room.members.forEach(id => io.to(id).emit("user-left", socket.id))
            }

            // Host reassignment
            if (room.host === socket.id) {
                if (room.members.length > 0) {
                    room.host = room.members[0]
                    room.members.forEach(id => io.to(id).emit("host-changed", room.host))
                    io.to(room.host).emit("you-are-host")
                } else {
                    delete rooms[path]
                    delete messages[path]
                }
            }

            if (room.host) io.to(room.host).emit("waiting-room-update", room.waitingRoom)

            delete socketMeta[socket.id]
            delete timeOnline[socket.id]
        })
    })

    return io
}
