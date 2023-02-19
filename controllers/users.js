const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const usersGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  if (isNaN(limit) && isNaN(from)) {
    limit = 5;
    from = 0;
  }

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const usersPost = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Save in DB
  await user.save();

  res.json({
    user,
  });
};

const usersPut = async (req, res = response) => {
  const { id } = req.params;
  const { password, google, status, _id, __v, ...rest } = req.body;

  if (password) {
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest, { new: true });

  res.json({
    user,
  });
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const status = { status: false };

  const user = await User.findByIdAndUpdate(id, status);
  const authUser = req.user;

  return res.json({
    user,
    authUser,
  });
};

const usersPatch = (req, res = response) => {
  res.json({
    msg: "PATCH api",
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch,
};
