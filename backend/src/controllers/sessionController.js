
import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

// Generate a unique 6-character alphanumeric join code
function generateJoinCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    // Ensure difficulty is lowercase
    const normalizedDifficulty = difficulty.toLowerCase();

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // generate unique join code (retry if collision)
    let joinCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      joinCode = generateJoinCode();
      const existingSession = await Session.findOne({ joinCode });
      if (!existingSession) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: "Failed to generate unique join code. Please try again." });
    }

    // create session in db with join code
    const session = await Session.create({ 
      problem, 
      difficulty: normalizedDifficulty, 
      host: userId, 
      callId,
      joinCode 
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty: normalizedDifficulty, sessionId: session._id.toString() },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    // Create join link
    const joinLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/session/${session._id}`;

    res.status(201).json({ 
      session,
      sessionId: session._id,
      joinCode: session.joinCode,
      joinLink 
    });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // Get all sessions where user is either host or participant (not just completed)
    const sessions = await Session.find({
      $or: [{ host: userId }, { participant: userId }],
    })
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId")
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate statistics
    const totalSessions = sessions.length;
    const createdSessions = sessions.filter(s => s.host._id.toString() === userId.toString()).length;
    const joinedSessions = sessions.filter(s => s.participant?._id.toString() === userId.toString()).length;
    const completedSessions = sessions.filter(s => s.status === "completed").length;
    const activeSessions = sessions.filter(s => s.status === "active").length;

    res.status(200).json({ 
      sessions,
      stats: {
        total: totalSessions,
        created: createdSessions,
        joined: joinedSessions,
        completed: completedSessions,
        active: activeSessions
      }
    });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinByCode(req, res) {
  try {
    const { joinCode } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!joinCode) {
      return res.status(400).json({ message: "Join code is required" });
    }

    // Find session by join code (case-insensitive)
    const session = await Session.findOne({ 
      joinCode: joinCode.toUpperCase(),
      status: "active" 
    });

    if (!session) {
      return res.status(404).json({ message: "Invalid join code or session not found" });
    }

    if (session.host.toString() === userId.toString()) {
      // Host can rejoin their own session
      const joinLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/session/${session._id}`;
      return res.status(200).json({ 
        sessionId: session._id,
        joinLink,
        message: "You are the host of this session" 
      });
    }

    // Check if session is full
    if (session.participant && session.participant.toString() !== userId.toString()) {
      return res.status(409).json({ message: "Session is full" });
    }

    // Add user as participant if not already
    if (!session.participant) {
      session.participant = userId;
      await session.save();

      // Add to chat channel
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkId]);
    }

    const joinLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/session/${session._id}`;
    
    res.status(200).json({ 
      sessionId: session._id,
      joinLink,
      message: "Successfully joined session" 
    });
  } catch (error) {
    console.log("Error in joinByCode controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
