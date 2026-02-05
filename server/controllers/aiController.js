const OpenAI = require("openai");
const Note = require("../models/Note");
const Chat = require("../models/Chat");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate AI summary for a note
exports.generateSummary = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find the note
    const note = await Note.findOne({
      _id: noteId,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Generate summary using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates concise, clear summaries of notes. Keep summaries under 100 words.",
        },
        {
          role: "user",
          content: `Please summarize this note:\n\nTitle: ${note.title}\nTopic: ${note.topic}\n\nContent:\n${note.content}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content;

    // Save summary to note
    note.aiSummary = summary;
    await note.save();

    res.json({ summary });
  } catch (error) {
    console.error("Generate summary error:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};

// Chat with AI about a note
exports.chatWithNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Find the note
    const note = await Note.findOne({
      _id: noteId,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Find or create chat history
    let chat = await Chat.findOne({
      noteId: noteId,
      userId: req.userId,
    });

    if (!chat) {
      chat = new Chat({
        noteId: noteId,
        userId: req.userId,
        messages: [],
      });
    }

    // Add user message to history
    chat.messages.push({
      role: "user",
      content: message,
    });

    // Prepare messages for OpenAI
    const systemMessage = {
      role: "system",
      content: `You are a helpful AI assistant helping a student understand their notes. Here is the note content:

Title: ${note.title}
Topic: ${note.topic}

Content:
${note.content}

Answer questions about this note concisely and helpfully. If asked something not related to the note, politely redirect to the note content.`,
    };

    const messages = [
      systemMessage,
      ...chat.messages.slice(-10).map((m) => ({
        // Keep last 10 messages for context
        role: m.role,
        content: m.content,
      })),
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI response to history
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    await chat.save();

    res.json({
      response: aiResponse,
      chatId: chat._id,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};

// Get chat history for a note
exports.getChatHistory = async (req, res) => {
  try {
    const { noteId } = req.params;

    const chat = await Chat.findOne({
      noteId: noteId,
      userId: req.userId,
    });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({ messages: chat.messages });
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

// Clear chat history for a note
exports.clearChatHistory = async (req, res) => {
  try {
    const { noteId } = req.params;

    await Chat.findOneAndDelete({
      noteId: noteId,
      userId: req.userId,
    });

    res.json({ message: "Chat history cleared" });
  } catch (error) {
    console.error("Clear chat error:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
};
