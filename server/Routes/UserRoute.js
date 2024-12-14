const express = require("express");
const {
  register,
  login,
  getUser,
  editUser,
  changePassword,
} = require("../Controller/UserController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get/:id", getUser);
router.patch("/updateUser/:id", editUser);
router.patch("/Password/:id", changePassword);

module.exports = router;
