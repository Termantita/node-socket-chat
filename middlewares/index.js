const validateFields = require("../middlewares/validate-fields");
const validateRoles = require("../middlewares/validate-roles");
const validateFile = require("../middlewares/validate-file");
const validateJWT = require("../middlewares/validate-jwt");

module.exports = {
  ...validateFields,
  ...validateRoles,
  ...validateFile,
  ...validateJWT,
};
