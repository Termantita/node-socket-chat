const { Router } = require("express");
const { check } = require("express-validator");

const {
  loadFiles,
  // updateImage,
  updateImageCloud,
  showImage,
} = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");
const { validateFields, validateFile } = require("../middlewares");

const router = Router();

router.get("/:collection/:id", [
  check("id", "El id debe ser de Mongo").isMongoId(),
  check("collection").custom((c) =>
    allowedCollections(c, ["users", "products"])
  ),
  showImage,
]);

router.post("/", validateFile, loadFiles);

router.put(
  "/:collection/:id",
  [
    validateFile,
    check("id", "El id debe ser de Mongo").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validateFields,
  ],
  updateImageCloud
  // updateImage
);

module.exports = router;
