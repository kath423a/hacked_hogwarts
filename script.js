"use strict";

//Eventlistener for loading the DOM, then go to the function "getData"
document.addEventListener("DOMContentLoaded", getData);

//Variables created:
let names;
let filter = "all";

//Get the array
async function getData() {
  const JSONData = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
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

      //Eventlisteners bliver tilføjet hver article, så man via klik bliver henvist til vores singleview-site, via visDetaljer-funktionen
      klon
        .querySelector("article")
        .addEventListener("click", () => visDetaljer(entry));

      //for hvert objekt bliver templated tilføjet vores container som nyt child.
      container.appendChild(klon);
    }
  });
}

function visDetaljer(entry) {
  popup.style.display = "block";
  popup.querySelector(".actorname").textContent = `${entry.fullname}`;
  popup.querySelector(".moviename").textContent = `${entry.movie}`;
}

document
  .querySelector("#luk")
  .addEventListener("click", () => (popup.style.display = "none"));
