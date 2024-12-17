// Lägg till dagens datum i sidebaren
document.getElementById("datetime").innerHTML = new Date().toLocaleDateString();

// Hanterar meny-toggling
function toggleMenu() {
    document.querySelector('.sidenav').classList.toggle('active');
}

// Huvudobjekt för toDo-listor
let toDoLists = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
};

// Uppdatera listan för en specifik dag
function uppdateraOutput(day) {
    const list = toDoLists[day].map((item, index) => `
        <li draggable="true" ondragstart="startDrag(event, '${day}', ${index})" 
            ondragover="allowDrop(event)" ondrop="drop(event, '${day}', ${index})">
            <input type="checkbox" ${item.checked ? "checked" : ""} 
                onchange="toggleCheckbox('${day}', ${index}, this)">
            ${item.task}
            <i class='fa-regular fa-pen-to-square' onclick='redigera("${day}", ${index})'></i>
            <i class='fa-solid fa-trash' onclick='taBort("${day}", ${index})'></i>
            <div class="arrow-buttons">
                <button onclick="moveUp('${day}', ${index})"><i class='fa-solid fa-arrow-up'></i></button>
                <button onclick="moveDown('${day}', ${index})"><i class='fa-solid fa-arrow-down'></i></button>
            </div>
        </li>
    `).join("");
    document.getElementById(`${day.toLowerCase()}Out`).innerHTML = list;
}

// Lägg till en uppgift
function laggaTill(day, inputId) {
    const input = document.getElementById(inputId);
    if (input.value) {
        toDoLists[day].push({ task: input.value, checked: false });
        input.value = "";
        sparaOchUppdatera(day);
    }
}

// Ta bort en uppgift
function taBort(day, index) {
    toDoLists[day].splice(index, 1);
    sparaOchUppdatera(day);
}

// Hantera checkbox-status
function toggleCheckbox(day, index, checkbox) {
    toDoLists[day][index].checked = checkbox.checked;
    sparaTillLocalStorage();
}

// Redigera en uppgift
let redigeringsIndex = null;

function redigera(day, index) {
    const input = document.getElementById(`${day.toLowerCase()}Input`);
    input.value = toDoLists[day][index].task;
    redigeringsIndex = index;
    visaRedigeringsKnappar(day, true);
}

function sparaRedigering(day, inputId) {
    const input = document.getElementById(inputId);
    if (input.value && redigeringsIndex !== null) {
        toDoLists[day][redigeringsIndex].task = input.value;
        redigeringsIndex = null;
        visaRedigeringsKnappar(day, false);
        sparaOchUppdatera(day);
    }
}

// Hjälpfunktion för att visa/dölja redigeringsknappar
function visaRedigeringsKnappar(day, redigerar) {
    document.querySelector(`button[onclick*="laggaTill('${day}"]`).style.display = redigerar ? "none" : "inline-block";
    document.querySelector(`button[onclick*="sparaRedigering('${day}"]`).style.display = redigerar ? "inline-block" : "none";
}

// Återställ alla listor
function rensa() {
    Object.keys(toDoLists).forEach(day => toDoLists[day] = []);
    sparaOchUppdateraAlla();
    console.log("Alla veckans listor har rensats.");
}

// Spara till localStorage och uppdatera en dag
function sparaOchUppdatera(day) {
    sparaTillLocalStorage();
    uppdateraOutput(day);
}

// Spara och uppdatera alla dagar
function sparaOchUppdateraAlla() {
    sparaTillLocalStorage();
    Object.keys(toDoLists).forEach(uppdateraOutput);
}

// Spara och ladda från localStorage
function sparaTillLocalStorage() {
    localStorage.setItem("toDoLists", JSON.stringify(toDoLists));
}

function lasFranLocalStorage() {
    const sparadData = localStorage.getItem("toDoLists");
    if (sparadData) {
        toDoLists = JSON.parse(sparadData);
        Object.keys(toDoLists).forEach(day => {
            toDoLists[day] = toDoLists[day].map(item => 
                typeof item === "string" ? { task: item, checked: false } : item
            );
        });
    }
}

// Drag-and-drop funktioner
let draggedIndex = null, draggedDay = null;

function startDrag(event, day, index) {
    draggedIndex = index;
    draggedDay = day;
    event.dataTransfer.effectAllowed = "move";
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, day, targetIndex) {
    event.preventDefault();
    if (draggedIndex !== null) {
        const item = toDoLists[draggedDay].splice(draggedIndex, 1)[0];
        toDoLists[day].splice(targetIndex, 0, item);
        sparaOchUppdateraAlla();
        draggedIndex = draggedDay = null;
    }
}

// Flytta upp/ner i listan
function moveUp(day, index) {
    if (index > 0) {
        bytPlats(day, index, index - 1);
    }
}

function moveDown(day, index) {
    if (index < toDoLists[day].length - 1) {
        bytPlats(day, index, index + 1);
    }
}

function bytPlats(day, fromIndex, toIndex) {
    [toDoLists[day][fromIndex], toDoLists[day][toIndex]] = 
        [toDoLists[day][toIndex], toDoLists[day][fromIndex]];
    sparaOchUppdatera(day);
}

// Initial inläsning
document.addEventListener("DOMContentLoaded", () => {
    lasFranLocalStorage();
    Object.keys(toDoLists).forEach(uppdateraOutput);
});