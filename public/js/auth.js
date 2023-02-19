// HTML References
const form = document.querySelector("form");
const btnLogOut = document.querySelector("#google-logout");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://restserver-production-3553.up.railway.app/api/auth/";

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const formData = {};

  for (let el of form.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }

  fetch(url + "login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }

      localStorage.setItem("token", token);
      window.location = 'chat.html';
    })
    .catch((err) => {
      console.log(err);
    });
});

function handleCredentialResponse(response) {
  const body = { id_token: response.credential };

  fetch(url + "google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("email", res.user.email);
      localStorage.setItem("token", res.token);
      window.location = 'chat.html';
    })
    .catch(console.warn);
}

btnLogOut.addEventListener("click", () => {
  console.log(google.accounts.id);
  window.google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
});
