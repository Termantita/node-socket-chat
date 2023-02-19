const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require("express");
const { fileUpload } = require("../helpers");

const { User, Product } = require("../models");

/**
 * @param {request} req
 * @param {response} res
 */
const loadFiles = async (req, res) => {
  let fileName;

  try {
    fileName = await fileUpload(req.files, ["txt", "md"], "texts");
  } catch (e) {
    return res.status(400).json({ msg: e });
  }

  res.json({
    fileName,
  });
};

/**
 * @param {request} req
 * @param {response} res
 */
const updateImage = async (req, res) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpieza previa de imagenes
  if (model.img) {
    const imgPath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }

  model.img = await fileUpload(req.files, undefined, collection);

  await model.save();

  res.json({ model });
};

const updateImageCloud = async (req, res) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpieza previa de imagenes
  if (model.img) {
    const nameArr = model.img.split('/');
    const fileName = nameArr[nameArr.length - 1];
    const [ public_id ] = fileName.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url

  await model.save();

  res.json({ model });
};

/**
 * @param {request} req
 * @param {response} res
 */
const showImage = async (req, res) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpieza previa de imagenes
  if (model.img) {
    const imgPath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imgPath)) {
      return res.sendFile(imgPath);
    }
  }

  const noImgPath = path.join(__dirname, "../assets/no-image.jpg")
  res.sendFile(noImgPath);
};

module.exports = {
  loadFiles,
  updateImage,
  updateImageCloud,
  showImage,
};
