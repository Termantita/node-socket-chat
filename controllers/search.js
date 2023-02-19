const { response, request } = require("express");

const { ObjectId } = require("mongoose").Types;

const { User, Category, Product } = require("../models");

const allowedCollections = ["categories", "products", "roles", "users"];

/**
 * @param {String} term
 * @param {response} res
 */

const searchCategories = async (term = "", res) => {
  const isMongoID = ObjectId.isValid(term);
  term = term.toUpperCase();
  if (isMongoID) {
    const category = await Category.findById(term);

    return res.json({ results: [category || []] });
  }

  let categories;
  if (term.includes("*")) {
    categories = await Category.find();
  } else {
    const regex = new RegExp(term, "i");
    categories = await Category.find({ name: regex, status: true });
  }

  return res.json({
    results: [categories || []],
  });
};

const searchProducts = async (term = "", res) => {
  const isMongoID = ObjectId.isValid(term);
  term = term.toUpperCase();
  if (isMongoID) {
    const product = await Product.findById(term);

    return res.json({ results: [product || []] });
  }

  let products;
  if (term.includes("*")) {
    products = await Product.find();
  } else {
    const regex = new RegExp(term, "i");
    products = await Product.find({ name: regex, status: true });
  }

  return res.json({
    results: [products || []],
  });
};

const searchUsers = async (term = "", res) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const user = await User.findById(term);
    return res.json({ results: user ? [user] : [] });
  }

  let user;
  // Si el término es igual o incluye el carácter '*'
  if (term.includes("*")) {
    user = await User.find();
  }
  // Si no
  else {
    const regex = new RegExp(term, "i");
    user = await User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ status: true }],
    });
  }

  return res.json({
    results: user ? [user] : [],
  });
};

/**
 * @param {request} req
 * @param {response} res
 */
const search = async (req, res) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${allowedCollections.join(", ")}`,
    });
  }

  switch (collection) {
    case "categories":
      await searchCategories(term, res);
      break;
    case "products":
      await searchProducts(term, res);
      break;
    case "roles":
      await searchRoles(term, res);
      break;
    case "users":
      await searchUsers(term, res);
      break;

    default:
      res.status(500).json({
        msg: "Ups! Olvide de hacer la busqueda 😋",
      });
  }
};

module.exports = {
  search,
  searchUsers,
};
