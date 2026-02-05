const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const noteController = require("../controllers/noteController");

// All routes require authentication
router.use(authenticateUser);

// Note routes
router.get("/", noteController.getNotes);
router.get("/:id", noteController.getNote);
router.post("/", noteController.createNote);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
