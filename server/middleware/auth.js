const { clerkClient } = require("@clerk/clerk-sdk-node");

const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify token with Clerk
    try {
      const sessionClaims = await clerkClient.verifyToken(token);
      req.userId = sessionClaims.sub;
      next();
    } catch (verifyError) {
      console.error("Token verification error:", verifyError);
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = { authenticateUser };
