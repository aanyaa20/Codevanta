import User from "../models/User.js";

// Update user preferences
export const updatePreferences = async (req, res) => {
  try {
    const userId = req.auth().userId; // Clerk user ID
    const { allowRemoteEditing } = req.body;

    if (typeof allowRemoteEditing !== "boolean") {
      return res.status(400).json({ message: "allowRemoteEditing must be a boolean" });
    }

    // Find user by clerkId and update preferences
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { 
        $set: { 
          "preferences.allowRemoteEditing": allowRemoteEditing 
        } 
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Preferences updated successfully",
      preferences: user.preferences
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user preferences
export const getPreferences = async (req, res) => {
  try {
    const userId = req.auth().userId; // Clerk user ID

    const user = await User.findOne({ clerkId: userId }).select("preferences");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      preferences: user.preferences || { allowRemoteEditing: true }
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
