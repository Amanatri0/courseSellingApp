const { Router } = require("express");
const { CoursesModel, PurchaseModel } = require("../public/db");
const { userMiddleware } = require("../middleware/user");

const coursesRouter = Router();

coursesRouter.post("/purchase", userMiddleware, async (req, res) => {
  const userId = req.id;
  const courseId = req.body.courseId;

  const alreayBoughtCourses = await PurchaseModel.find({
    userId,
  });

  // here after mapping each courseId is fetched.
  // const coursePurcashedByTheUser = alreayBoughtCourses.map((x) => console.log(x.courseId));   // i have tried to log the value here just to check.
  const coursePurcashedByTheUser = alreayBoughtCourses.map((x) => x.courseId);

  try {
    for (const element of coursePurcashedByTheUser) {
      if (element == courseId) {
        return res.status(403).send({
          message: "Course has already been purcashed",
        });
      }
    }
    await PurchaseModel.create({
      userId,
      courseId,
    });
  } catch (error) {
    res.status(404).send({
      message: "Course purcahse not successful",
      error: error.message,
    });
  }

  res.json({
    message: "You have successfully purchased a course",
  });
});

coursesRouter.get("/preview", async (req, res) => {
  const course = await CoursesModel.find({});

  res.json({
    course,
  });
});

module.exports = {
  coursesRouter,
};
