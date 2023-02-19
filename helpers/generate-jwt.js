const jwt = require("jsonwebtoken");
const { User } = require("../models");

const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATE_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.error(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const checkJWT = async (token) => {
  try {
    if (token.length < 10) {
      return null;
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATE_KEY);
    const user = await User.findById(uid);

    if (user) {
      if (!user.status) {
        return null;
      }
      return user;
    }
    return null;
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateJWT,
  checkJWT,
};
