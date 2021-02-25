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
  middlename: "null",
  nickname: "null",
};

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
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
function loadJSON() {
  fetch("//petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });

  buildList();
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    const student = Object.create(Student);

    //Find the names by creating the firstSpace and lastSpace:
    const firstSpace = jsonObject.fullname.trim().indexOf(" ");
    const lastSpace = jsonObject.fullname.trim().lastIndexOf(" ");

    //Split fullname to first- and lastname:
    student.firstName = jsonObject.fullname.trim().substring(0, firstSpace);
    student.lastName = jsonObject.fullname.trim().substring(lastSpace).trim();

    //Find middlename and nickname:
    student.middleName = jsonObject.fullname.substring(firstSpace, lastSpace);
    if (student.middleName.includes(' " ')) {
      student.nickName = student.middleName;
      student.middleName = "";
    }

    //Correct the capitalization of names:
    student.firstNameCap = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1, firstSpace).toLowerCase();
    student.middleNameCap = student.middleName.substring(1, 2).toUpperCase() + student.middleName.substring(1, lastSpace).toLowerCase();
    student.lastNameCap = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1).toLowerCase();

    //Get gender and correct the capitalization:
    student.gender = jsonObject.gender.substring(0).trim();
    student.genderCap = student.gender.substring(0, 1).toUpperCase() + student.gender.substring(1).toLowerCase(student.lastName.length);

    //Get house and correct the capitalization:
    student.house = jsonObject.house.substring(0).trim();
    student.houseCap = student.house.substring(0, 1).toUpperCase() + student.house.substring(1).toLowerCase();

    //Inset in the array:
    student.firstName = student.firstNameCap;
    student.middleName = student.middleNameCap;
    student.lastName = student.lastNameCap;
    student.gender = student.genderCap;
    student.house = student.houseCap;

    allStudents.push(student);
  });
  displayList(allStudents);
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);

  setFilter(filter);
  buildList();
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

function isGryffindor(house) {
  return house.house === "Gryffindor";
}

function isHufflepuff(house) {
  return house.house === "Hufflepuff";
}

function isSlytherin(house) {
  return house.house === "Slytherin";
}

function isRavenclaw(house) {
  return house.house === "Ravenclaw";
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find "old" sortby element, and remove .sortBy
  //const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  //oldElement.classList.remove("sortby");

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
  sortedList = allStudents;
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

  console.log(sortedList);

  displayList(sortedList);
}

function displayList(students) {
  //clear the list
  document.querySelector("#student_list").innerHTML = "";

  // console.log(students);

  //build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // console.log(student);
  //create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  //set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;

  document.getElementById("student_list").appendChild(clone);
}
