class Message {
  constructor(uid, name, msg) {
    this.uid = uid;
    this.name = name;
    this.msg = msg;
  }
}

class ChatMessages {
  constructor() {
    this.messages = [];
    this.users = {};
  }

  get last10() {
    this.messages = this.messages.splice(0, 10);
    return this.messages;
  }

  get usersArr() {
    return Object.values(this.users);
  }

  sendMessage(uid, name, msg) {
    this.messages.unshift(new Message(uid, name, msg));
  }

  connectUser(user) { 
    this.users[user.id] = user;
  }

  disconnectUser(id) {
    delete this.users[id];
  }
}


module.exports = ChatMessages;