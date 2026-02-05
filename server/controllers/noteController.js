const Note = require("../models/Note");

// Get all notes for a user
exports.getNotes = async (req, res) => {
  try {
    console.log("Fetching notes for user:", req.userId);
    const notes = await Note.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });

    console.log("Found notes:", notes.length);
    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// Get single note
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

// Create new note
exports.createNote = async (req, res) => {
  try {
    console.log("Creating note for user:", req.userId);
    console.log("Note data:", req.body);

    const { title, content, topic, tags } = req.body;

    if (!title || !content || !topic) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const note = new Note({
      userId: req.userId,
      title,
      content,
      topic,
      tags: tags || [],
    });

    await note.save();
    console.log("Note created successfully:", note._id);
    res.status(201).json(note);
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { title, content, topic, tags } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, content, topic, tags, updatedAt: Date.now() },
      { new: true },
    );

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
};
