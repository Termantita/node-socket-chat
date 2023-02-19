const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT, isAdminRole } = require("../middlewares");
const {
  productByIdExists,
  categoryByIdExists,
} = require("../helpers/db-validators");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const router = Router();

// Get all products - Public
router.get("/", getProducts);

// Get a single product via id - Public
router.get(
  "/:id",
  [check("id").custom(productByIdExists), validateFields],
  getProductById
);

// Create product - Private, with token
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("category", "No es un id de Mongo válido").isMongoId(),
    check("category").custom(categoryByIdExists),
    validateFields,
  ],
  createProduct
);

// Update product - Private, with token
router.put(
  "/:id",
  [
    validateJWT,    // check("name", "El nombre es obligatorio").not().isEmpty(),

    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(productByIdExists),
    validateFields,
  ],
  updateProduct
);

// Delete product - Private, admin only
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(productByIdExists),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
