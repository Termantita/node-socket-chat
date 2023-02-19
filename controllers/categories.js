const { response, request } = require("express");

const { Category } = require("../models");

// getCategories - listing - total ✅ - populate ❌
/**
 * @param {request} req
 * @param {response} res
 */
const getCategories = async (req, res) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  if (isNaN(limit) && isNaN(from)) {
    limit = 5;
    from = 0;
  }

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .skip(Number(from))
      .limit(Number(limit))
      .populate("user", "name"),
  ]);
  // console.log(`Nos encontramos en la categoría ${category.name}, y su estado es ${category.status}`);
  // res.json({
  //   msg: `Nos encontramos en la categoría ${category.name}, y su estado es ${category.status}`
  // });
  res.json({
    total,
    categories: categories,
  });
};

// getCategories ✅ - populate {} ❌
/**
 * @param {request} req
 * @param {response} res
 */
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate("user", "name");

  res.json({
    category,
  });
};

/**
 * @param {request} req
 * @param {response} res
 */
const createCategory = async (req, res) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoría ${categoryDB.name} ya existe`,
    });
  }

  // Generate data to save
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  await category.save();

  res.status(201).json(category);
};

// updateCategory ✅
/**
 * @param {request} req
 * @param {response} res
 */
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { status, ...rest } = req.body;

  rest.name = rest.name.toUpperCase();
  rest.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, rest, { new: true });

  res.json({
    category,
  });
};

// deleteCategory - status: false ✅
/**
 * @param {request} req
 * @param {response} res
 */
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const status = { status: false };

  const category = await Category.findByIdAndUpdate(id, status, { new: true });
  const authUser = req.user;

  return res.json({
    category,
    authUser,
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
