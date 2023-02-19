const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");
const { ChatMessages } = require("../models");

const chatMessages = new ChatMessages();

/**
 *
 * @param {Socket} socket
 */
const socketController = async (socket, io) => {
  const user = await checkJWT(socket.handshake.headers["x-token"]);

  if (!user) {
    return socket.disconnect();
  }

  // Add the connected user
  chatMessages.connectUser(user);
  io.emit("active-users", chatMessages.usersArr);
  socket.emit("receive-messages", chatMessages.last10);

  // Connect to a special channel
  socket.join(user.id);

  socket.on('disconnect', () => {
    chatMessages.disconnectUser(user.id);
    io.emit("active-users", chatMessages.usersArr);
  })

  socket.on('send-message', ({uid, message}) => {
    if (uid) {
      // Private message
      socket.to(uid).emit('private-message', {from: user.name, message});
    } else {
      chatMessages.sendMessage(user.id, user.name, message);
      io.emit('receive-messages', chatMessages.last10);
    }

  })
};

module.exports = {
  socketController,
};
