const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const aiController = require("../controllers/aiController");

// All routes require authentication
router.use(authenticateUser);

// AI routes
router.post("/summary/:noteId", aiController.generateSummary);
router.post("/chat/:noteId", aiController.chatWithNote);
router.get("/chat/:noteId", aiController.getChatHistory);
router.delete("/chat/:noteId", aiController.clearChatHistory);

module.exports = router;
