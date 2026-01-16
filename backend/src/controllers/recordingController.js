import Recording from "../models/Recording.js";
import Session from "../models/Session.js";
import { streamClient } from "../lib/stream.js";

/**
 * GET /api/recordings
 * Get all recordings for the logged-in user
 */
export async function getMyRecordings(req, res) {
  try {
    const userId = req.user._id;
    console.log("📹 Fetching recordings for user:", userId);

    const recordings = await Recording.find({
      $or: [{ host: userId }, { participant: userId }],
      // Show all recordings (recording, processing, ready, failed)
    })
      .populate("host", "name email profileImage")
      .populate("participant", "name email profileImage")
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`✅ Found ${recordings.length} recordings`);
    res.status(200).json({ recordings });
  } catch (error) {
    console.error("❌ Error in getMyRecordings:", error);
    res.status(500).json({ message: "Failed to fetch recordings" });
  }
}

/**
 * GET /api/recordings/:id
 * Get a specific recording details
 */
export async function getRecordingById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const recording = await Recording.findById(id)
      .populate("host", "name email profileImage")
      .populate("participant", "name email profileImage");

    if (!recording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    // Check if user has access to this recording
    const hasAccess =
      recording.host._id.toString() === userId.toString() ||
      recording.participant?._id.toString() === userId.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ recording });
  } catch (error) {
    console.error("Error in getRecordingById:", error);
    res.status(500).json({ message: "Failed to fetch recording" });
  }
}

/**
 * POST /api/recordings/start
 * Called when recording starts (from frontend)
 */
export async function startRecording(req, res) {
  try {
    const { sessionId, callId, problemTitle, difficulty } = req.body;
    const userId = req.user._id;

    console.log("🎥 START RECORDING REQUEST:");
    console.log("  SessionId:", sessionId);
    console.log("  CallId:", callId);
    console.log("  User:", userId);

    const session = await Session.findById(sessionId).populate("participant", "name email");
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if user is host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only host can start recording" });
    }

    // Create recording record
    const recording = await Recording.create({
      sessionId,
      callId,
      recordingUrl: "pending", // Will be updated when Stream provides URL
      problemTitle: problemTitle || session.problem,
      difficulty: difficulty || session.difficulty,
      host: session.host,
      participant: session.participant,
      startedAt: new Date(),
      status: "recording",
    });

    console.log("✅ Recording saved to MongoDB:", recording._id);
    console.log("📹 Recording details:", {
      id: recording._id,
      callId: recording.callId,
      status: recording.status,
      problemTitle: recording.problemTitle
    });

    res.status(201).json(recording);
  } catch (error) {
    console.error("❌ Error in startRecording:", error);
    res.status(500).json({ message: "Failed to start recording" });
  }
}

/**
 * POST /api/recordings/stop
 * Called when recording stops
 */
export async function stopRecording(req, res) {
  try {
    const { recordingId, callId } = req.body;

    // Update recording to processing status
    const recording = await Recording.findById(recordingId);
    if (!recording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    recording.endedAt = new Date();
    recording.status = "processing";
    
    // Try to get recording URL from Stream immediately
    try {
      const call = streamClient.video.call("default", callId);
      const recordings = await call.queryRecordings();

      if (recordings.recordings && recordings.recordings.length > 0) {
        const latestRecording = recordings.recordings[recordings.recordings.length - 1];
        recording.recordingUrl = latestRecording.url;
        recording.downloadUrl = latestRecording.url;
        
        // Calculate duration if we have start time
        if (latestRecording.start_time && recording.startedAt) {
          const startTime = new Date(latestRecording.start_time);
          const endTime = recording.endedAt;
          recording.duration = Math.round((endTime - startTime) / 1000);
        }
        
        // If recording has a URL immediately, mark as ready
        if (latestRecording.url) {
          recording.status = "ready";
        }
      }
    } catch (streamError) {
      console.error("Error fetching from Stream (will retry via webhook):", streamError);
      // Don't fail - webhook will update it later
    }

    await recording.save();
    res.status(200).json(recording);
  } catch (error) {
    console.error("Error in stopRecording:", error);
    res.status(500).json({ message: "Failed to stop recording" });
  }
}

/**
 * POST /api/recordings/:id/refresh
 * Manually fetch recording status from Stream
 */
export async function refreshRecording(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log("🔄 REFRESH RECORDING REQUEST:", id);

    const recording = await Recording.findById(id);
    if (!recording) {
      console.log("❌ Recording not found in database:", id);
      return res.status(404).json({ message: "Recording not found" });
    }

    console.log("✅ Found recording:", {
      id: recording._id,
      callId: recording.callId,
      status: recording.status,
      recordingUrl: recording.recordingUrl
    });

    // Check if user has access
    const hasAccess =
      recording.host.toString() === userId.toString() ||
      recording.participant?.toString() === userId.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch from Stream
    try {
      console.log("📡 Querying Stream API for callId:", recording.callId);
      
      if (!recording.callId) {
        console.log("❌ No callId found on recording");
        return res.status(400).json({ message: "Recording has no callId" });
      }
      
      const call = streamClient.video.call("default", recording.callId);
      
      // Use listRecordings() instead of queryRecordings()
      const recordings = await call.listRecordings();

      console.log("📹 Stream API Response:");
      console.log("  Total recordings found:", recordings.recordings?.length || 0);
      
      if (recordings.recordings && recordings.recordings.length > 0) {
        recordings.recordings.forEach((rec, idx) => {
          console.log(`  Recording ${idx + 1}:`, {
            url: rec.url,
            filename: rec.filename,
            start_time: rec.start_time,
            end_time: rec.end_time,
          });
        });

        const latestRecording = recordings.recordings[recordings.recordings.length - 1];
        
        if (latestRecording.url) {
          recording.recordingUrl = latestRecording.url;
          recording.downloadUrl = latestRecording.url;
          recording.status = "ready";
          
          // Calculate duration
          if (latestRecording.start_time && latestRecording.end_time) {
            const start = new Date(latestRecording.start_time);
            const end = new Date(latestRecording.end_time);
            recording.duration = Math.round((end - start) / 1000);
          }

          await recording.save();
          console.log(`✅ Recording ${id} updated to ready with URL!`);
          console.log("   URL:", latestRecording.url);
        } else {
          console.log("⏳ Recording found but no URL yet (still processing)");
        }
      } else {
        console.log("❌ No recordings found on Stream for this call!");
        console.log("   This means Stream never actually started recording.");
        return res.status(404).json({ 
          message: "No recording found on Stream. The recording may have failed to start." 
        });
      }
    } catch (streamError) {
      console.error("❌ Stream API error:", streamError.message);
      console.error("   Error name:", streamError.name);
      console.error("   Error code:", streamError.code);
      console.error("   Full error:", JSON.stringify(streamError, null, 2));
      
      // More specific error messages
      if (streamError.message?.includes("not found") || streamError.code === 404) {
        return res.status(404).json({ 
          message: "Call not found on Stream. The recording may not have been started properly.",
          details: streamError.message
        });
      }
      
      if (streamError.message?.includes("unauthorized") || streamError.code === 401) {
        return res.status(500).json({ 
          message: "Stream API authentication failed. Please contact support.",
          details: "API credentials issue"
        });
      }
      
      return res.status(500).json({ 
        message: "Recording is still being processed by Stream. Try again in a minute.",
        details: streamError.message
      });
    }

    res.status(200).json(recording);
  } catch (error) {
    console.error("❌ Error in refreshRecording:", error);
    res.status(500).json({ message: "Failed to refresh recording" });
  }
}

/**
 * Webhook endpoint for Stream to notify us when recording is ready
 * POST /api/recordings/webhook
 */
export async function recordingWebhook(req, res) {
  try {
    const { type, call_cid, recording } = req.body;

    if (type === "call.recording_ready") {
      // Extract callId from call_cid (format: "default:session_...")
      const callId = call_cid.split(":")[1];

      // Update recording status to ready
      await Recording.findOneAndUpdate(
        { callId, status: "processing" },
        {
          recordingUrl: recording.url,
          downloadUrl: recording.url,
          status: "ready",
        }
      );

      console.log(`✅ Recording ready for call: ${callId}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error in recordingWebhook:", error);
    res.status(500).json({ message: "Webhook error" });
  }
}

/**
 * DELETE /api/recordings/:id
 * Delete a recording
 */
export async function deleteRecording(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log("🗑️ DELETE RECORDING REQUEST:", { recordingId: id, userId });

    const recording = await Recording.findById(id);
    if (!recording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    // Check if user has permission to delete (host or participant)
    const hasAccess =
      recording.host.toString() === userId.toString() ||
      recording.participant?.toString() === userId.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: "You don't have permission to delete this recording" });
    }

    console.log("✅ Deleting recording:", recording.problemTitle);

    // Delete from database
    await Recording.findByIdAndDelete(id);

    console.log("✅ Recording deleted successfully");
    res.status(200).json({ message: "Recording deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting recording:", error);
    res.status(500).json({ message: "Failed to delete recording", error: error.message });
  }
}
