import Note from "../models/Note.js";

// Existing function - keep as is
export const getTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;
    res.json({ transcript });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save a note to history
export const saveNote = async (req, res) => {
  try {
    const { videoUrl, pdfUrl, title } = req.body;

    if (!videoUrl || !pdfUrl) {
      return res.status(400).json({ message: "videoUrl and pdfUrl are required" });
    }

    const note = await Note.create({
      user: req.user._id,
      videoUrl,
      pdfUrl,
      title: title || "Untitled Video"
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get history for logged in user
export const getHistory = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};