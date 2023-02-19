const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { connectDB } = require("../db/config");

const { socketController } = require('../sockets/controller');

class Server {
  constructor() {
    // Express App
    this.app = express();
    this.server = require("http").createServer(this.app);
    this.io = require('socket.io')(this.server);
    this.port = process.env.PORT || 8080;

    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      users: "/api/users",
      uploads: "/api/uploads",
    };

    // this.usersPath = '/api/users';
    // this.authPath = '/api/auth';
    // this.catPath = '/api/categories';

    // Connect to database
    this.connectDB();

    // Middlewares
    this.middlewares();

    // App Routes
    this.routes();

    // Sockets
    this.sockets();
  }

  async connectDB() {
    await connectDB();
  }

  middlewares() {
    // Public Directory
    this.app.use(express.static("public"));

    //CORS
    this.app.use(cors());

    // Read and parse of the body
    this.app.use(express.json());

    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  sockets() {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Listening on port " + this.port);
    });
  }
}

module.exports = Server;
