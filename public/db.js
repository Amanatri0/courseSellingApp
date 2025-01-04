const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Users = new Schema({
  username: String,
  password: String,
  email: { type: String, unique: true },
});

const Admin = new Schema({
  username: String,
  password: String,
  email: { type: String, unique: true },
});

const Courses = new Schema({
  title: String,
  description: String,
  price: Number,
  courseCreator: ObjectId,
});

const Purchase = new Schema({
  userId: ObjectId,
  courseId: ObjectId,
  ref: {},
});

const UserModel = new mongoose.model("users", Users);
const PurchaseModel = new mongoose.model("purchase", Purchase);
const AdminModel = new mongoose.model("admin", Admin);
const CoursesModel = new mongoose.model("course", Courses);

module.exports = {
  UserModel,
  PurchaseModel,
  AdminModel,
  CoursesModel,
};
