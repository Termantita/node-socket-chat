const { response, request } = require("express");

const { Product } = require("../models");

// getProducts - listing - total ✅ - populate ❌
/**
 * @param {request} req
 * @param {response} res
 */
const getProducts = async (req, res) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  if (isNaN(limit) && isNaN(from)) {
    limit = 5;
    from = 0;
  }

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .skip(Number(from))
      .limit(Number(limit))
      .populate("user", "name")
      .populate("category", "name"),
  ]);
  // console.log(`Nos encontramos en la categoría ${product.name}, y su estado es ${product.status}`);
  // res.json({
  //   msg: `Nos encontramos en la categoría ${product.name}, y su estado es ${product.status}`
  // });
  res.json({
    total,
    products: products,
  });
};

// getProducts ✅ - populate {} ❌
/**
 * @param {request} req
 * @param {response} res
 */
const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate("user", "name");

  res.json({
    product,
  });
};

/**
 * @param {request} req
 * @param {response} res
 */
const createProduct = async (req, res) => {
  const { status, user, ...body } = req.body;
  const name = body.name.toUpperCase();
  const productDB = await Product.findOne({ name });

  if (productDB) {
    return res.status(400).json({
      msg: `El producto ${productDB.name} ya existe`,
    });
  }

  // Generate data to save
  const data = {
    ...body,
    name,
    user: req.user._id,
  };

  const product = new Product(data);

  await product.save();

  res.status(201).json(product);
};

// updateProduct ✅
/**
 * @param {request} req
 * @param {response} res
 */
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { status, ...data } = req.body;

  if (data.name) data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json({
    product,
  });
};

// deleteProduct - status: false ✅
/**
 * @param {request} req
 * @param {response} res
 */
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const status = { status: false };

  const product = await Product.findByIdAndUpdate(id, status, { new: true });
  const authUser = req.user;

  return res.json({
    product,
    authUser,
  });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
