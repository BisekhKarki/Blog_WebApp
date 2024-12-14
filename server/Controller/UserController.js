const user = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");

const generateToken = (id, username, email) => {
  return jsonWebToken.sign({ id, username, email }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

const register = async (req, res) => {
  const { username, email, password, picture } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please fill all the details",
      });
    }
    const findUserByEmail = await user.findOne({ email });
    if (findUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "User with the email already exists",
      });
    }

    if (password.lenght < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be 6 characters minimum",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({
      username,
      email,
      password: hashedPassword,
      picture,
    });
    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const User = await user.findOne({ email });
    if (!User) {
      return res.status(400).json({
        success: true,
        message: "Invalid Email",
      });
    }

    const checkPassword = await bcrypt.compare(password, User.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: true,
        message: "Incorrect Passsword \n Please try again",
      });
    }

    const token = generateToken(User._id, User.username, User.email);
    return res.status(200).json({
      success: true,
      message: "Logged in successfull",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const findUser = await user.findById(id);
    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: findUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const users = await user.findOne({ _id: id });
    const updatedDetails = {};

    for (const key in data) {
      if (data[key] !== users[key]) {
        updatedDetails[key] = data[key];
      }
    }
    if (Object.keys(updatedDetails).length > 0) {
      const result = await user.updateOne(
        {
          _id: id,
        },
        {
          $set: updatedDetails,
        }
      );
      res.status(200).json({
        success: true,
        message: "Profile Updated",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to update profile",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const findUser = await user.findById(id);
    if (!findUser) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const checkOldPassword = await bcrypt.compare(password, findUser.password);
    if (checkOldPassword) {
      res.status(400).json({
        success: false,
        message: "Use a different Password",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const updateUser = await user.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        password: hashPassword,
      },
      { new: true }
    );

    if (!updateUser) {
      res.status(404).json({
        success: false,
        message: "Unable to change Password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password changed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  editUser,
  changePassword,
};
