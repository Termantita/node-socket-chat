const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT, isAdminRole } = require("../middlewares");
const { categoryByIdExists } = require("../helpers/db-validators");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

const router = Router();

// Get all categories - Public
router.get("/", getCategories);

// Get a single category via id - Public
router.get(
  "/:id",
  [check("id").custom(categoryByIdExists), validateFields],
  getCategoryById
);

// Create category - Private, with token
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  createCategory
);

// Update category - Private, with token
router.put(
  "/:id",
  [
    validateJWT,
    check('name', "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(categoryByIdExists),
    validateFields,
  ],
  updateCategory
);

// Delete category - Private, admin only
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(categoryByIdExists),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
