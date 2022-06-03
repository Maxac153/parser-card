const { ipcRenderer } = require("electron");

document.querySelector(".create-cards-post").addEventListener("click", (e) => {
  let links = [];
  let numberCard = [];
  links = document.querySelector(".links").value.split("\n");
  numberCard = document.querySelector(".number-card").value.split("\n");
  ipcRenderer.send("add-cards", links.filter(link => link !== ""), numberCard.filter(link => link !== ""));
});
