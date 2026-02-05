const { clerkClient } = require("@clerk/clerk-sdk-node");

const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token with Clerk
    const session = await clerkClient.sessions.verifySession(token);

    if (!session) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Add userId to request
    req.userId = session.userId;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = { authenticateUser };
