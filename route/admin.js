const { Router } = require("express");
const adminRouter = Router();

// Jwt for token creation
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

// zod for validating the input in the body
const z = require("zod");

// requireing the database
const { AdminModel, CoursesModel } = require("../public/db");

// bcrypt for password hashing and salting
const bcrypt = require("bcrypt");
const { adminMiddleware } = require("../middleware/admin"); // destructure before requiring the middleware

// admin can signup here

adminRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().email().min(3),
    username: z.string().min(3),
    password: z.string().min(3),
  });

  const parsedBody = requiredBody.safeParse(req.body);

  if (!parsedBody.success) {
    res.json({
      message: "Admin credentials incorrect",
    });
  }

  const { email, username, password } = req.body; // destructure the response from body

  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    await AdminModel.create({
      email: email,
      username: username,
      password: hashedPassword,
    });
    res.json({
      message: "Signup Successfull",
    });
  } catch (error) {
    res.status(403).send({
      message: "Unable to create the Admin. Admin already exists",
      error,
    });
  }
});

// admin can login to the account
adminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await AdminModel.findOne({
    email: email,
  });

  if (!admin) {
    res.json({
      message: "Admin email and password is incorrect.",
    });
    return;
  }
  const hashedPassword = await bcrypt.compare(password, admin.password);

  if (hashedPassword) {
    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_PASSWORD
    );

    res.json({
      token: token,
    });
  } else {
    res.status(403).send({
      message: "Admin doesn't exists",
    });
  }
});

// admin can create courses here

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.id;

  const { title, description, price } = req.body;

  const course = await CoursesModel.create({
    title: title,
    description: description,
    price: price,
    courseCreator: adminId,
  });

  res.json({
    message: "Course has been created",
    courseId: course.id,
  });
});

// admin can update courses here

adminRouter.put("/courses", adminMiddleware, async (req, res) => {
  const adminId = req.id;

  const { title, description, price, courseId } = req.body;

  const user = await AdminModel.findOne({
    adminId,
  });

  if (!user) {
    res.status(401).send({
      message: `Unable to fetch the courses of admin id: ${adminId} `,
    });
  }

  const course = await CoursesModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title: title,
      description: description,
      price: price,
    }
  );

  res.json({
    message: "Course has been updated",
    course: course,
  });
});

// admin can get all the courses that were created by the admin

adminRouter.get("/bulk/courses", adminMiddleware, async (req, res) => {
  const adminId = req.id;

  const courses = await CoursesModel.find({
    creatorId: adminId,
  });

  res.json({
    message: "Courses fetched successful",
    courses,
  });
});

module.exports = {
  adminRouter,
};
