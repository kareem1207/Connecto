import { firebaseConfig } from "../database/firebaseConfig.mjs";

let firebaseApp;
try {
  firebaseApp = firebase.app();
} catch (e) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const messageContainer = document.getElementById("message-container");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const error = document.getElementById("error-message");
const room = document.getElementById("roomId");
const emoji = document.getElementById("emoji-button");
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

let emojiMenuVisible = false;

const emojiPicker = document.querySelector("emoji-picker");
emojiPicker.style.display = "none";

function getUserInfo() {
  const user = firebase.auth().currentUser;
  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }
}

room.innerText = `Room Id : ${roomId}`;

database.ref(`rooms/${roomId}/messages`).on("child_added", (snapshot) => {
  const message = snapshot.val();
  displayMessage(message.text, message.sender);
});

messageInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

emoji.addEventListener("click", (event) => {
  event.stopPropagation();
  emojiMenuVisible = !emojiMenuVisible;
  emojiPicker.style.display = emojiMenuVisible ? "block" : "none";
  emojiPicker.style.position = "fixed";
});

emojiPicker.addEventListener("emoji-click", (event) => {
  messageInput.value += event.detail.unicode;
});

emojiPicker.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", () => {
  if (emojiMenuVisible) {
    emojiMenuVisible = false;
    emojiPicker.style.display = "none";
  }
});

sendButton.addEventListener("click", (event) => {
  event.preventDefault();
  const user = getUserInfo();

  if (!user) {
    alert("Please login first");
    return;
  }

  const messageText = messageInput.value.trim();
  if (messageText && roomId) {
    const newMessageRef = database.ref(`rooms/${roomId}/messages`).push();
    newMessageRef
      .set({
        text: messageText,
        sender: user.displayName,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        messageInput.value = "";
        error.textContent = "";
      })
      .catch((err) => {
        error.textContent = `Failed to send message. Please try again.\nError: ${err.message}`;
        setTimeout(() => {
          error.textContent = "";
        }, 3000);
      });
  } else {
    error.textContent =
      "Please enter a message, and ensure you're in a valid room.";
    setTimeout(() => {
      error.textContent = "";
    }, 3000);
  }
});

function displayMessage(text, sender) {
  const user = getUserInfo();
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    sender === user.displayName ? "sent-message" : "received-message"
  );
  messageElement.textContent = `${sender}: ${text}`;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
