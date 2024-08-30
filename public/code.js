(function () {
  const app = document.querySelector(".app");
  const socket = io("https://chat-app-2024-fx88.onrender.com/");

  let uname;

  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      console.log("Join button clicked, username:", username);
      if (username.length == 0) {
        console.log("Username is empty, returning.");
        return;
      }
      socket.emit("newuser", username);
      console.log("Emitted newuser event with username:", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    });

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let message = app.querySelector(".chat-screen #message-input").value;
      console.log("Send message button clicked, message:", message);
      if (message.length == 0) {
        console.log("Message is empty, returning.");
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message,
      });
      console.log("Rendered my message:", { username: uname, text: message });
      socket.emit("chat", {
        username: uname,
        text: message,
      });
      console.log("Emitted chat event with message:", {
        username: uname,
        text: message,
      });
      app.querySelector(".chat-screen #message-input").value = "";
    });

  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });

  socket.on("update", function (update) {
    renderMessage("update", update);
  });
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    console.log("Rendering message:", { type, message });
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
          <div>
            <div class="name">You</div>
            <div class="text">${message.text}</div>
          </div>
        `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
          <div>
            <div class="name">${message.username}</div>
            <div class="text">${message.text}</div>
          </div>
        `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    // scroll chat to end
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
