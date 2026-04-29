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
      user: req.user.id,  // ✅ fixed: was req.user._id
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
    const notes = await Note.find({ user: req.user.id })  // ✅ fixed: was req.user._id
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Make sure user owns this note
    if (note.user.toString() !== req.user.id.toString()) {  // ✅ fixed: was req.user._id
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();
    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};