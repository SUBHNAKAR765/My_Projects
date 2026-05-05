import mongoose, { Schema } from "mongoose"

const meetingSchema = new Schema({
    user_id:      { type: String, required: true },
    meetingCode:  { type: String, required: true },
    date:         { type: Date, default: Date.now },
    duration:     { type: Number, default: 0 },   // seconds
    participants: { type: [String], default: [] }
})

const Meeting = mongoose.model("Meeting", meetingSchema)
export { Meeting }
