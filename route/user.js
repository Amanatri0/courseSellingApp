const { Router } = require("express");
const userRouter = Router();

// Jwt for token creation
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

// zod for validating the input in the body
const z = require("zod");

// requireing the database
const { UserModel, PurchaseModel, CoursesModel } = require("../public/db");

// bcrypt for password hashing and salting
const bcrypt = require("bcrypt");
const { userMiddleware } = require("../middleware/user");

// user can signup here

userRouter.post("/signup", async (req, res) => {
  // first we will need to check the input the user is providing, that is valid or not using zod

  const requiredBody = z.object({
    username: z.string().min(3),
    password: z.string().min(8),
    email: z.string().email(),
  });

  // parsed the data to the req.body

  const parsedBody = requiredBody.safeParse(req.body);

  // if the parsed data is not successful throw error

  if (!parsedBody.success) {
    res.status(403).send({
      message: "Incorrect username, email or password",
    });
    return;
  }

  // if the parsed data is successful store the data below
  // destructure the data and store

  const { email, username, password } = req.body;

  // hash the password before storing it to the database, also use salting.

  const hashedPassword = await bcrypt.hash(password, 5);

  // store the validated users information and hashed password in the database

  try {
    await UserModel.create({
      username: username,
      password: hashedPassword,
      email: email,
    });
  } catch (error) {
    console.log(error);
  }

  res.json({
    message: "User sign up successful",
  });
});

// user can login to the account

userRouter.post("/login", async (req, res) => {
  // before login in check the users email and password

  const { email, password } = req.body;

  // find the user in the database

  const user = await UserModel.findOne({
    email: email,
  });

  // compare the password and check if the password matches with the user

  const matchedPassword = bcrypt.compare(password, user.password);

  if (!user && !matchedPassword) {
    res.json({
      message: "User email and password is incorrect.",
    });
    return;
  }

  if (matchedPassword) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_PASSWORD
    );

    res.json({
      token: token,
    });
  }
});

userRouter.get("/purchase", userMiddleware, async (req, res) => {
  const userId = req.id;

  const userPurcahse = await PurchaseModel.find({
    userId,
  });

  if (!userPurcahse) {
    return res.json({
      message: "User has not purchased courses please purcahse courses",
    });
  }

  //  find the courses from the CoursesModel with the _id
  const purchasedCourses = await CoursesModel.find({
    _id: {
      $in: userPurcahse.map((x) => x.courseId),
    },
  });

  res.json({
    userPurcahse,
    purchasedCourses,
  });
});

module.exports = {
  userRouter,
};
