const jwt = require('jsonwebtoken');
const { Response, Request } = require('express');

const User = require('../models/user');

/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {*} next 
 */
const validateJWT = async (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      masg: 'No se encuentra el token en la petición'
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATE_KEY);

    const user = await User.findById(uid);

    if (!user) {
      throw new Error('Uid no existente en la base de datos');
    }

    if (!user.status) {
      throw new Error('Usuario inactivo / eliminado');
    }

    req.user = user;

    if (!uid) {
      return res.status(401).json({
        msg: 'No se ha encontrado el uid en la DB'
      });
    }

    
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: 'Token no valido'
    })
  };

}


module.exports = {
  validateJWT
}