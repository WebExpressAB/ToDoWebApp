const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Lägger till dagens datum i sidebaren
var now = new Date();
var date = now.toLocaleDateString(); // Ger endast datumet
document.getElementById("datetime").innerHTML = date;

// Hamburger-meny
function toggleMenu() {
    const sidenav = document.querySelector('.sidenav');
    sidenav.classList.toggle('active');
}

// Lägg till en uppgift
function addTask() {
    if (inputBox.value === "") {
        alert("You must write something");
    } else {
        let li = document.createElement("li");
        li.setAttribute("draggable", "true");
        li.innerHTML = `
            ${inputBox.value} 
            <i class="fa-regular fa-pen-to-square edit" onclick="editTask(this)"></i>
            <span class="delete">\u00D7</span>`;
        listContainer.appendChild(li);
        inputBox.value = "";
        saveData();
        setupDragAndDrop();
    }
}

// Markera och ta bort en uppgift
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.classList.contains("delete")) {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

// Spara till localStorage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Visa sparade uppgifter
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
    setupDragAndDrop();
}

// Dra och släpp funktionalitet
function setupDragAndDrop() {
    const items = document.querySelectorAll("#list-container li");
    let draggedItem = null;

    items.forEach((item) => {
        item.addEventListener("dragstart", function (e) {
            draggedItem = item;
            setTimeout(() => item.classList.add("hidden"), 0);
        });

        item.addEventListener("dragend", function (e) {
            setTimeout(() => item.classList.remove("hidden"), 0);
            draggedItem = null;
        });

        item.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        item.addEventListener("dragenter", function (e) {
            e.preventDefault();
            this.classList.add("over");
        });

        item.addEventListener("dragleave", function (e) {
            this.classList.remove("over");
        });

        item.addEventListener("drop", function (e) {
            this.classList.remove("over");
            if (draggedItem && this !== draggedItem) {
                const children = Array.from(listContainer.children);
                const draggedIndex = children.indexOf(draggedItem);
                const targetIndex = children.indexOf(this);

                if (draggedIndex < targetIndex) {
                    this.after(draggedItem);
                } else {
                    this.before(draggedItem);
                }
                saveData();
            }
        });
    });
}

// Redigera en uppgift
function editTask(editButton) {
    event.stopPropagation(); 
    const li = editButton.parentElement; // Hitta listpunkten som ikonen tillhör
    const currentText = li.textContent.replace("\u00D7", "").trim(); // Hämta text utan "×"
    inputBox.value = currentText; // Flytta texten till input-fältet
    li.remove(); // Ta bort den befintliga punkten från listan
    inputBox.focus(); // Fokusera på input-fältet
    saveData(); // Uppdatera localStorage
}
document.addEventListener("DOMContentLoaded", function () {
    showTask();
});