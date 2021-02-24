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
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
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

  //split the fullname into first- and lastname and get that data
  const texts = jsonObject.fullname.split(" ");
  student.firstname = texts[0].substring(0, 1).toUpperCase() + texts[0].substring(1);
  student.lastname = texts[1];
  student.gender = jsonObject.gender;
  student.house = jsonObject.house.toLowerCase().trim();

  return student;
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);

  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList;
}

function filterList(filteredList) {
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  }

  return filteredList;
}

function isGryffindor(student) {
  return student.house === "gryffindor";
}

function isHufflepuff(student) {
  return student.house === "hufflepuff";
}

function isSlytherin(student) {
  return student.house === "slytherin";
}

function isRavenclaw(student) {
  return student.house === "ravenclaw";
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find "old" sortby element, and remove .sortBy
  const oldElement = document.querySelector(`[data-sort='${sortBy}']`);
  // oldElement.classList.remove("sortby");

  // indicate active sort
  event.target.classList.add("sortby");

  // toggle the direction!
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  // let sortedList = allStudents
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  // console.log(sortedList);

  displayList(sortedList);
}

function displayList(students) {
  //clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // console.log(students);

  //build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // console.log(student);
  //create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  //set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstname;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;

  document.getElementById("student_list").appendChild(clone);
}
