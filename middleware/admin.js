const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next) {
  const token = req.headers.token;

  try {
    if (!token) {
      return res.status(401).send({
        message: "Token doesn't match please send the correct token",
      });
    }

    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);

    req.id = decoded.id;
    next();
  } catch (error) {
    res.status(401).send({
      message: " User middleware authentication failed",
      error: error.message,
    });
  }
}

module.exports = {
  adminMiddleware: adminMiddleware,
};
