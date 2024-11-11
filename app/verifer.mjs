import { firebaseConfig } from "../database/firebaseConfig.mjs";

let firebaseApp;
try {
  firebaseApp = firebase.app();
} catch (e) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}

const input = document.querySelector("#id-verifier-input");
const btn = document.querySelector("#verify-button");
function error(message) {
  document.querySelector("#error-message").innerText = message;
  setTimeout(() => {
    document.querySelector("#error-message").innerText = "";
  }, 5000);
}
function getUserInfo() {
  const user = firebase.auth().currentUser;
  if (user)
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
}
const roomExistence = async (value) => {
  try {
    const idExists = await firebase
      .database()
      .ref(`roomIds/${value}`)
      .once("value");
    return idExists.exists();
  } catch (e) {
    console.error(e);
    return false;
  }
};
btn.addEventListener("click", async () => {
  const aboutUser = getUserInfo();
  console.log(aboutUser);
  if (!aboutUser) {
    alert("Please log in");
    return;
  }
  const value = input.value;
  const existence = await roomExistence(value);
  if (value == "") {
    error("please enter details perfectly");
  } else if (value.length < 8) {
    error("Id should contain 8 digits (the id is shorter )");
  } else if (value.length > 8) {
    error("Id should contain 8 digits (the id is too big )");
  } else if (!existence) {
    error("Room does not exist");
  } else {
    window.location.href = `chatPage.html?roomId=${value}`;
  }
});
