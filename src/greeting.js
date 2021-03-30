"use strict";

const userForm = document.querySelector(".user__form"),
  userInput = userForm.querySelector("input"),
  userBtn = userForm.querySelector("button"),
  greetings = document.querySelector(".user__greetings"),
  greetTitle = greetings.querySelector(".greeting__title"),
  greetEdit = greetings.querySelector("button");

const USER_LS = "crruentUser";
const SHOWING = "showing";

function saveName(name) {
  localStorage.setItem(USER_LS, name);
}

function paintName(name) {
  userForm.classList.remove(SHOWING);
  greetings.classList.add(SHOWING);
  greetTitle.innerText = `Hello ${name}!`;
}

function handleSumbit(e) {
  e.preventDefault();
  const name = userInput.value;
  if (name === "") {
    return alert("이름을 작성하세요");
  }
  userInput.value = "";
  paintName(name);
  saveName(name);
}

function askForName() {
  userForm.classList.add(SHOWING);
  userForm.addEventListener("submit", handleSumbit);
}

function loadName() {
  const loadedName = localStorage.getItem(USER_LS);
  if (loadedName === null) {
    askForName();
  } else {
    paintName(loadedName);
  }
}

function handleEdit() {
  userForm.classList.add(SHOWING);
  greetings.classList.remove(SHOWING);
  // greetEdit.classList.remove(SHOWING);
  userInput.focus();
}

function init() {
  loadName();
  userBtn.addEventListener("click", handleSumbit);
  greetEdit.addEventListener("click", handleEdit);
}

init();
