const path = require("path");
const { v4: uuidv4 } = require("uuid");

const fileUpload = (
  files,
  validExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    console.log("req.files >>>", files); // eslint-disable-line

    const { file } = files;

    let ext = file.name.split(".");
    ext = ext[ext.length - 1];

    // Validar la extension
    if (!validExtensions.includes(ext)) {
      return reject(
        `La extensión ${ext} no está permitida\nExtensiones permitidas: ${validExtensions}`
      );
    }
    const fileName = uuidv4() + "." + ext;
    const uploadPath = path.join(__dirname, "../uploads/", folder, fileName);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(fileName);
    });
  });
};

module.exports = {
  fileUpload,
};
