let user;
let socket;

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://restserver-production-3553.up.railway.app/api/auth/";

// HTML References
const txtUid = document.querySelector("#txtUid");
const txtMsg = document.querySelector("#txtMsg");
const ulUsers = document.querySelector("#ulUsers");
const ulMsgs = document.querySelector("#ulMsgs");
const btnLogout = document.querySelector("#btnLogout");

const validateJWT = async () => {
  const token = localStorage.getItem("token") || "";
  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }

  const resp = await fetch(url, {
    headers: { "x-token": token },
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  user = userDB;
  document.title = user.name;

  await connectSocket();
};

const connectSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Sockets online");
  });

  socket.on("disconnect", () => {
    console.log("Sockets offline");
  });

  socket.on("receive-messages", drawMessages);

  socket.on("active-users", drawUsers);

  socket.on("private-message", ({from, message: msg}) => {
    console.log("Privado:", {from, msg});
    const message = `      
    <li>
      <p>
        <span class="text-primary">De ${from}</span>
        <span>${msg}</span>
      </p>
    </li>`;

    ulMsgs.innerHTML = message;
  });
};

/**
 *
 * @param {Array} users
 */
const drawUsers = (users) => {
  let usersHtml = "";
  users.forEach(({ name, uid }) => {
    usersHtml += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>`;
  });

  ulUsers.innerHTML = usersHtml;
};

/**
 *
 * @param {Array} messages
 */
const drawMessages = (messages) => {
  let messagesHtml = "";
  messages.forEach(({ name, msg }) => {
    messagesHtml += `
      <li>
        <p>
          <span class="text-primary">${name}</span>
          <span>${msg}</span>
        </p>
      </li>`;
  });

  ulMsgs.innerHTML = messagesHtml;
};

txtMsg.addEventListener("keyup", ({ keyCode }) => {
  const message = txtMsg.value;
  const uid = txtUid.value;

  if (keyCode !== 13) return;

  if (message.length === 0) return;

  socket.emit("send-message", { message, uid });

  txtMsg.value = "";
});

const main = async () => {
  await validateJWT();
};

main();
