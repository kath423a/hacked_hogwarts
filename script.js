"use strict";

//Eventlistener for loading the DOM, then go to the function "getData"
document.addEventListener("DOMContentLoaded", getData);

//Variables created:
let names;
let filter = "all";

//Get the array
async function getData() {
  const JSONData = await fetch("./students.json");
  names = await JSONData.json();

  showNames();
}

//Objects from the array put in the HTML
function showNames() {
  const container = document.querySelector("#container");
  const temp = document.querySelector("template");

  //Each object in the array/sheet gets cloned into the template in the HTML
  names.forEach((entry) => {
    if (filter == "all") {
      let klon = temp.cloneNode(true).content;
      klon.querySelector(".student_name").textContent = `${entry.fullname}`;
      klon.querySelector(".student_house").textContent = `${entry.house}`;

      //Eventlisteners for article, so "click" goes to popup, via showPopup-funktionen
      klon
        .querySelector("article")
        .addEventListener("click", () => showPopup(entry));

      //For each object the template will add to the container as a new child
      container.appendChild(klon);
    }
  });
}

function showPopup(entry) {
  popup.style.display = "block";

  //Make the popup with all the details
  popup.querySelector(".firstname").textContent = `${entry.fullname}`;
  popup.querySelector(".middlename").textContent = `${entry.movie}`;

  //Get the images from 'images'-folder
  popup.querySelector(
    ".studentphoto"
  ).src = `images/${titel.gsx$billede.$t}.png`;
}

document
  .querySelector("#luk")
  .addEventListener("click", () => (popup.style.display = "none"));
