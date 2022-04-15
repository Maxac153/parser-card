const { ipcRenderer } = require("electron");
let loader = document.querySelector(".loader");
let rateCard = document.querySelector(".rate-card");
const cardList = document.getElementById("cardList");

const updateNumber = (e) => {
  ipcRenderer.send("update-number", e.target.id, e.target.value);
};

const updatePrice = (e) => {
  loader.classList.remove("hide");
  cardList.classList.add("hide");
  ipcRenderer.send("update-price", e.target.id);
};

const deleteItem = (e) => {
  ipcRenderer.send("delete-card", e.target.id);
};

ipcRenderer.on("links", (event, links) => {
  loader.classList.add("hide");
  cardList.classList.remove("hide");
  const cardItems = links["links"].reduce((html, link, num) => {
    html += `<div class="card">
      <div>
        <p class="card-name">${links["cardName"][num]}</p>
        <p class="additional-data">Дополнительная информация:</p>
        <p class="additional-data">${links["mode"][num]}</p>
        <p class="additional-data">${links["foil"][num]}</p>
        <p class="additional-data">${links["Set"][num]}</p>
      </div>
      <div class="price">
        <p class="price-card dollar">${links["price"][num]}</p>
        <p class="price-card rubel">${Math.ceil(
          links["price"][num] * rateCard.value
        )}</p>
      </div>
      <div class="OOS-i">
        <p class="OOS-p">
        ${links["outOfStock"][num]}
        </p>
      </div>
      <div class="count">
        <input type="number" class="number-card" id={"${link}"} value="${
      links["number"][num]
    }" />
      </div>
      <div class="btms">
        <button class="btm-up" id="${link}">🗘</button>
        <button class="btm-remove" id="${link}">✖</button>
      </div>
    </div>
    `;
    return html;
  }, "");
  cardList.innerHTML = cardItems;
  ipcRenderer.on("hide", () => {
    loader.classList.remove("hide");
    cardList.classList.add("hide");
  });
  cardList.querySelectorAll(".number-card").forEach((item) => {
    item.addEventListener("click", updateNumber);
    item.addEventListener("input", updateNumber);
  });
  cardList.querySelectorAll(".btm-up").forEach((item) => {
    item.addEventListener("click", updatePrice);
  });
  cardList.querySelectorAll(".btm-remove").forEach((item) => {
    item.addEventListener("click", deleteItem);
  });
});

document.querySelector("#search").oninput = function () {
  let val = this.value.trim();
  let elasticItems = document.querySelectorAll(".card");
  if (val != "") {
    elasticItems.forEach(function (elem) {
      if (elem.innerHTML.search(val) == -1) elem.classList.add("hide");
      else elem.classList.remove("hide");
    });
  } else {
    elasticItems.forEach(function (elem) {
      elem.classList.remove("hide");
    });
  }
};

document.getElementById("cardForm").addEventListener("submit", (evt) => {
  loader.classList.remove("hide");
  cardList.classList.add("hide");
  evt.preventDefault();
  let input = evt.target;
  ipcRenderer.send("add-card", input[2].value, input[3].value);
  input[2].value = "";
  input[3].value = "";
});

document.querySelector(".rate-card").addEventListener("input", (e) => {
  ipcRenderer.send("rerender");
});

document.getElementById("btn-update").addEventListener("click", (e) => {
  loader.classList.remove("hide");
  cardList.classList.add("hide");
  e.preventDefault();
  ipcRenderer.send("update", loader, cardList);
});

document.getElementById("btn-export").addEventListener("click", (e) => {
  e.preventDefault();
  ipcRenderer.send("export-excel", rateCard.value);
});

document.getElementById("btn-import").addEventListener("click", (e) => {
  ipcRenderer.send("add-card-window");
});
