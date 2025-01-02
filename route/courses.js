const { Router } = require("express");

const coursesRouter = Router();

coursesRouter.get("/purchased", (req, res) => {
  res.json({
    message: "Course purchased route",
  });
});

module.exports = {
  coursesRouter,
};
