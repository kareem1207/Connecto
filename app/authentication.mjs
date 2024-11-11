import { firebaseConfig } from "../database/firebaseConfig.mjs";
let firebaseApp;
try {
  firebaseApp = firebase.app();
} catch (e) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}

const button = document.querySelector("#signin-button");
const image = document.querySelector("#profile-pic");

let userInfo = {};

button.addEventListener("click", () => {
  try {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  } catch (err) {
    console.error("An error occurred", err);
    throw err;
  }
});
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    button.style.display = "none";
    image.src = userInfo.photoURL;
    image.style.display = "block";
    document.querySelector("#signout-button").style.display = "block";
  }
});
document.querySelector("#signout-button").addEventListener("click", () => {
  button.style.display = "block";
  image.style.display = "none";
  document.querySelector("#signout-button").style.display = "none";
  userInfo = {};
  try {
    firebase.auth().signOut();
  } catch (err) {
    console.error("An error occurred", err);
    throw err;
  }
});
