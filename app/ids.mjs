import { nanoid } from "https://cdnjs.cloudflare.com/ajax/libs/nanoid/4.0.2/nanoid.js";
import { firebaseConfig } from "../database/firebaseConfig.mjs";
let firebaseApp;
try {
  firebaseApp = firebase.app();
} catch (e) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}

class RoomManager {
  constructor() {
    this.roomId = null;
    this.roomIdDisplay = document.querySelector("#room-id");
    this.createButton = document.querySelector("#create-room");
    this.initializer();
  }
  generateRoomId() {
    this.roomId = nanoid(8);
    return this.roomId;
  }

  getUserInfo() {
    const user = firebase.auth().currentUser;
    if (user)
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    else {
      alert("Please login ");
    }
  }

  initializer() {
    this.createButton.addEventListener("click", () => {
      const info = this.getUserInfo();
      if (info)
        if (!this.roomId) {
          this.roomId = this.generateRoomId();
          this.roomIdDisplay.textContent = `Room ID: ${this.roomId}`;
          this.createButton.innerText = "Go To room";
          this.createdRoomId();
        }
    });
  }
  createdRoomId() {
    this.addRoomId();
    this.createButton.removeEventListener("click", this.initializer);
    this.createButton.addEventListener("click", () => {
      if (this.roomId) {
        window.location.href = `chatPage.html?roomId=${this.roomId}`;
      }
    });
  }
  addRoomId() {
    const database = firebase.database();
    const roomRef = database.ref(`roomIds/${this.roomId}`).push();
    roomRef.set({
      id: this.roomId,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });
  }
}
const room = new RoomManager();
