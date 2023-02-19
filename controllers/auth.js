const { response } = require('express');

const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
  const {email, password} = req.body;

  try {
    // Verify if email exists
    const user = await User.findOne({ email: email});

    if (!user) {
      return res.status(400).json({
        msg: 'Usuario / Contraseña no son correctos - email'
      });
    };

    // Verify if user still active (status: true)
    if (!user.status) {
      return res.status(400).json({
        msg: 'Usuario / Contraseña no son correctos - status: false'
      });
    };

    // Verify password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Contraseña no son correctos - password'
      });
    };

    // Generate JWT
    const token = await generateJWT(user.id);
    
    res.json({
      user,
      token
    });

  } catch(err) {
    console.log(err);
    return res.status(500).json({
      msg: 'Algo salió mal'
    });
  };

};

/**
 * @param {Request} req 
 * @param {Response} res 
 */
const googleSignIn = async (req, res) => {
  const { id_token } = req.body;

  try {
    const { email, name, img } = await googleVerify(id_token);

    let user = await User.findOne({ email })
    // User doesn't exist
    if (!user) {
      const data = {
        name, 
        email, 
        password: 'GoogleSignIn',
        img,
        google: true,
        role: 'USER_ROLE',
      }

      user = new User(data);
      await user.save();
    }

    // User is deleted / { status: false }
    if (!user.status) {
      return res.status(401).json({
        msg: 'Hable con el administrador - Usuario bloqueado'
      })
    }
    
    // Generate JWT
    const token = await generateJWT(user.id);

    return res.json({
      user,
      token
    })

  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: 'Fallo al intentar verificar el token'
    })
  }
}

/**
 * @param {Request} req 
 * @param {Response} res 
 */
const renewToken = async (req, res) => {
  const { user } = req;


  // Generate JWT
  const token = await generateJWT(user.id);


  res.json({
    user,
    token,
  })
}


module.exports = {
  login,
  googleSignIn,
  renewToken,
};