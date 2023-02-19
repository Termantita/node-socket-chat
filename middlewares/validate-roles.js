const isAdminRole = async (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Se espera ejecutar la validación del token antes que del rol",
    });
  }

  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} no es administrador`,
    });
  }

  next();
};

const haveRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(500).json({
        msg: "Se espera ejecutar la validación del token antes que del rol",
      });
    }

    if (!roles.includes(req.user.role)) {
      res.status(401).json({
        msg: `La petición requiere de uno de estos roles: ${roles}`,
      });
    }

    // res.status(200).json({
    //   msg: "ok",
    // });

    next();
  };
};

module.exports = {
  isAdminRole,
  haveRole,
};
