"use strict";

//Eventlistener for loading the DOM, then go to the function "getData"
document.addEventListener("DOMContentLoaded", start);

//Variables created:
let allStudents = [];

//The prototype for all students:
const Student = {
  firstname: "",
  lastname: "",
  gender: "",
  house: "",
};

const settings = {
  filter: "all",
};

function start() {
  console.log("Readyyyyy");

  loadJSON();

  // Add event-listeners to filter and sort buttons
  registerButtons();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
}

//Get the array
async function loadJSON() {
  const response = await fetch("//petlatkea.dk/2021/hogwarts/students.json");
  const jsonData = await response.json();

  //When loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  //Filter the first load:
  buildList();
}

function prepareObject(jsonObject) {
  const student = Object.create(Student);

  const texts = jsonObject.fullname.split(" ");
  student.firstname = texts[0];
  student.lastname = texts[1];
  student.gender = jsonObject.gender;
  student.house = jsonObject.house;

  return student;
}

function selectFilter(event) {}

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
      klon.querySelector("article").addEventListener("click", () => showPopup(entry));

      //For each object the template will add to the container as a new child
      container.appendChild(klon);
    }
  });
}

function showPopup(entry) {
  popup.style.display = "block";

  //Make the popup with all the details
  popup.querySelector(".firstname").textContent = `${entry.fullname}`;

  //Get the images from 'images'-folder
  popup.querySelector(".studentphoto").src = `images/${titel.gsx$billede.$t}.png`;
}

document.querySelector("#luk").addEventListener("click", () => (popup.style.display = "none"));
