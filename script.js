"use strict";

//Eventlistener for loading the DOM, then go to the function "getData"
document.addEventListener("DOMContentLoaded", start);

//Variables created:
let allStudents = [];
let expelledList = [];

//The prototype for all students:
const Student = {
  firstname: "",
  lastname: "",
  gender: "",
  house: "",
  middlename: "null",
  nickname: "null",
  bloodStatus: "null",
  image: "",
  expelled: false,
  prefect: false,
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

    //Images:
    student.image = student.lastName + "_" + student.firstName.substring(0, 1) + ".png".toLowerCase();

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
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledList;
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

function isExpelled(student) {
  return student.expelled == "expelled";
}

function selectSort(event) {
  console.log(selectSort);
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find "old" sortby element, and remove .sortBy
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
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
  //sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    console.log(settings.sortBy);
    console.log(studentA);
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

  //console.log(students);

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

  clone.querySelector("#details_popup").addEventListener("click", () => showPopup(student));

  document.getElementById("student_list").appendChild(clone);
}

/*

POPUP

*/

function showPopup(student) {
  popup.style.display = "block";

  console.log("Showing the popup");

  //set student clone data - student detailed info:
  document.querySelector(".popfirstname").textContent = student.firstName;
  document.querySelector(".middlename").textContent = student.middleName;
  document.querySelector(".poplastname").textContent = student.lastName;
  document.querySelector(".nickname").textContent = student.nickName;
  //document.querySelector(".bloodstatus").textContent = student.bloodStatus;
  document.querySelector(".house").textContent = student.house;
  document.querySelector("img").src = `images/${student.image}`.toLowerCase();

  //show popup
  //document.querySelector("#popup").classList.add("");

  //Buttons
  document.querySelector("#popup #expell_student").addEventListener("click", clickExpel);
  function clickExpel() {
    expellStudent(student);
  }

  document.querySelector("#popup #prefect_student").addEventListener("click", clickPrefect);
  function clickPrefect() {
    prefectStudent(student);
  }
}

//Close the popup
document.querySelector("#luk").addEventListener("click", () => (popup.style.display = "none"));

/*

Expel students
*/

function expellStudent(student) {
  //close the popup
  document.querySelector("#luk").addEventListener("click", () => (popup.style.display = "none"));

  //expel the student:
  console.log(student);
  const eStudent = allStudents.indexOf(student);
  const expelledStudent = allStudents.splice(eStudent, 1);
  expelledList.unshift(expelledStudent[0]);
  console.log(expelledList);
  buildList();
}

function prefectStudent(student) {
  //close the popup
  document.querySelector("#luk").addEventListener("click", () => (popup.style.display = "none"));

  //make student prefect:
  console.log(student);
  if (student.prefect === true) {
    student.prefect = false;
  } else {
    checkPrefect(student);
  }
  buildList();
}

function checkPrefect(prefectedStudent) {
  const prefected = allStudents.filter((student) => student.prefect);
  const prefectedNumber = prefected.length;
  const other = prefected.filter((student) => student.house === prefectedStudent.house).shift();

  //check if there is another from same house:
  if (other !== undefined) {
    console.log("There can only be one from each house");
    removeOther(other);
  } else if (prefectedNumber >= 2) {
    console.log("There can only be two prefected students in total");
    removeAOrB(prefected[0], prefected[1]);
  } else {
    makePrefect(prefectedStudent);
  }

  function removeOther(other) {
    //ask to remove or ignore
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

    document.querySelector("#remove_other [data-field=otherwinner]").textContent = other.firstName;

    //if ignore - do nothing ..
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
    }

    //if remove other:
    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(prefectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removeAOrB(prefectA, prefectB) {
    //ask the user to ignore or remove A or B
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

    //show names on buttons
    document.querySelector("#remove_aorb [data-field=prefectA]").textContent = prefectA.firstName;
    document.querySelector("#remove_aorb [data-field=prefectB]").textContent = prefectB.firstName;

    //if ignore - do nothing ..
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      //if removeA:
      removePrefect(prefectA);
      makePrefect(prefectedStudent);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      //else - if removeB:
      removePrefect(prefectB);
      makePrefect(prefectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}
