const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Se ha establecido la conexión a la base de datos.');

  } catch (err) {
    console.log(err);
    throw new Error('Error en la conexión a la base de datos.');
  }
}

module.exports = {
  connectDB,
}