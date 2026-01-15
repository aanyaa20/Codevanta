import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    callId: {
      type: String,
      required: true,
    },
    recordingUrl: {
      type: String, // Stream provides this URL
      required: true,
    },
    downloadUrl: {
      type: String, // Alternative download URL
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
    },
    problemTitle: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["recording", "processing", "ready", "failed"],
      default: "recording",
    },
  },
  { timestamps: true }
);

recordingSchema.index({ sessionId: 1 });
recordingSchema.index({ host: 1 });
recordingSchema.index({ participant: 1 });
recordingSchema.index({ createdAt: -1 });

const Recording = mongoose.model("Recording", recordingSchema);

export default Recording;
