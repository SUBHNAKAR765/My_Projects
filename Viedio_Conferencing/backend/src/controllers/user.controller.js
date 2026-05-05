import httpStatus from "http-status"
import { User } from "../models/user.model.js"
import { Meeting } from "../models/meeting.model.js"
import bcrypt from "bcrypt"
import crypto from "crypto"

const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).json({ message: "Please provide username and password" })
    try {
        const user = await User.findOne({ username })
        if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" })

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect)
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid username or password" })

        const token = crypto.randomBytes(20).toString("hex")
        user.token = token
        await user.save()
        return res.status(httpStatus.OK).json({ token })
    } catch (e) {
        return res.status(500).json({ message: `Something went wrong: ${e}` })
    }
}

const register = async (req, res) => {
    const { name, username, password } = req.body
    try {
        const existingUser = await User.findOne({ username })
        if (existingUser)
            return res.status(httpStatus.FOUND).json({ message: "User already exists" })

        const hashedPassword = await bcrypt.hash(password, 10)
        await new User({ name, username, password: hashedPassword }).save()
        res.status(httpStatus.CREATED).json({ message: "User registered successfully" })
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e}` })
    }
}

const getUserHistory = async (req, res) => {
    const { token } = req.query
    try {
        const user = await User.findOne({ token })
        if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token" })
        const meetings = await Meeting.find({ user_id: user.username }).sort({ date: -1 })
        res.json(meetings)
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code, duration, participants } = req.body
    try {
        const user = await User.findOne({ token })
        if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token" })

        await new Meeting({
            user_id: user.username,
            meetingCode: meeting_code,
            duration: duration || 0,
            participants: participants || []
        }).save()

        res.status(httpStatus.CREATED).json({ message: "Added to history" })
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e}` })
    }
}

// Forgot password — generates a reset token and returns it (in production send via email)
const forgotPassword = async (req, res) => {
    const { username } = req.body
    try {
        const user = await User.findOne({ username })
        if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" })

        const resetToken = crypto.randomBytes(32).toString("hex")
        user.resetToken = resetToken
        user.resetTokenExpiry = Date.now() + 3600000 // 1 hour
        await user.save()

        // In production: send email with resetToken link
        // For now return token directly so frontend can use it
        res.json({ message: "Reset token generated", resetToken })
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e}` })
    }
}

// Reset password using token
const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body
    try {
        const user = await User.findOne({
            resetToken,
            resetTokenExpiry: { $gt: Date.now() }
        })
        if (!user) return res.status(400).json({ message: "Invalid or expired reset token" })

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetToken = undefined
        user.resetTokenExpiry = undefined
        await user.save()

        res.json({ message: "Password reset successfully" })
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e}` })
    }
}

export { login, register, getUserHistory, addToHistory, forgotPassword, resetPassword }
