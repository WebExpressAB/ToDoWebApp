//Lägga till så att dagens datum visas i sidebaren
var now = new Date();
var date = now.toLocaleDateString(); // Ger endast datumet

// Lägg till datumet i HTML
document.getElementById("datetime").innerHTML = date;

function toggleMenu() {
    console.log("Hamburger clicked!");
    const sidenav = document.querySelector('.sidenav');
    sidenav.classList.toggle('active');
}

let toDoLists = {
    Monday: ["Städa", "Plugga"],
    Tuesday: ["Moppa", "Jobba"],
    Wednesday: [],
    Thursday: [],
    Friday: []
};

function uppdateraOutput(day) {
    let output = "";
    toDoLists[day].forEach((item, index) => {
        output += `
            <li draggable="true" 
                ondragstart="startDrag(event, '${day}', ${index})" 
                ondragover="allowDrop(event)" 
                ondrop="drop(event, '${day}', ${index})">
                <input type='checkbox'>
                ${item}
                <i class='fa-regular fa-pen-to-square' onclick='redigera("${day}", ${index})'></i>
                <i class='fa-solid fa-trash' onclick='taBort("${day}", ${index})'></i>
            </li>
        `;
    });
    document.getElementById(`${day.toLowerCase()}Out`).innerHTML = output;
}

function laggaTill(day, inputId) {
    let input = document.getElementById(inputId).value;
    if (input) {
        toDoLists[day].push(input);
        document.getElementById(inputId).value = "";
        uppdateraOutput(day);
        sparaTillLocalStorage(); // Spara ändringarna
    }
}

function taBort(day, index) {
    toDoLists[day].splice(index, 1);
    uppdateraOutput(day);
    sparaTillLocalStorage(); // Spara ändringarna
}

//Funktion för att redigera task 
let redigeringsIndex = null;

function redigera(day, index) {
    // Fyll inputfältet med uppgiften som ska redigeras
    let inputId = `${day.toLowerCase()}Input`;
    document.getElementById(inputId).value = toDoLists[day][index];

    // Spara redigeringsindex
    redigeringsIndex = index;

    // Visa "Spara redigering"-knappen och dölj "Add"-knappen
    let addButton = document.querySelector(`button[onclick*="laggaTill('${day}"]`);
    let saveButton = document.querySelector(`button[onclick*="sparaRedigering('${day}"]`);
    addButton.style.display = "none";
    saveButton.style.display = "inline-block";
}
function sparaRedigering(day, inputId) {
    let input = document.getElementById(inputId).value;
    if (input && redigeringsIndex !== null) {
        // Uppdatera det redigerade objektet
        toDoLists[day][redigeringsIndex] = input;
        redigeringsIndex = null;

        // Rensa inputfältet
        document.getElementById(inputId).value = "";

        // Uppdatera listan och spara till localStorage
        uppdateraOutput(day);
        sparaTillLocalStorage();

        // Återställ knappar
        let addButton = document.querySelector(`button[onclick*="laggaTill('${day}"]`);
        let saveButton = document.querySelector(`button[onclick*="sparaRedigering('${day}"]`);
        addButton.style.display = "inline-block";
        saveButton.style.display = "none";
    }
}

  //Funktion för att nollställa lista
  function rensa() {
    // Nollställ toDoLists-objektet
    toDoLists = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: []
    };

    // Uppdatera alla dagars visning i gränssnittet
    Object.keys(toDoLists).forEach(day => {
        document.getElementById(`${day.toLowerCase()}Out`).innerHTML = ""; // Töm listans HTML
    });

    // Spara tomt objekt till localStorage
    sparaTillLocalStorage();
    console.log("Alla veckans listor har rensats.");
}

function sparaTillLocalStorage() {
    localStorage.setItem("toDoLists", JSON.stringify(toDoLists));
}

function lasFranLocalStorage() {
    const sparadData = localStorage.getItem("toDoLists");
    if (sparadData) {
        console.log("Data laddad från localStorage:", sparadData);
        toDoLists = JSON.parse(sparadData);
    } else {
        console.log("Ingen data hittad i localStorage.");
    }
}

// Lägg till detta för att läsa in listorna vid sidstart
document.addEventListener("DOMContentLoaded", function () {
    lasFranLocalStorage();
    Object.keys(toDoLists).forEach(day => uppdateraOutput(day));
});

//Skapar funktion för att kunna dra i sina todos och prioritera de 
let draggedIndex = null;
let draggedDay = null;

function startDrag(event, day, index) {
    draggedIndex = index;
    draggedDay = day;
    event.dataTransfer.effectAllowed = "move";
}

function allowDrop(event) {
    event.preventDefault(); // Tillåter dropp
}

function drop(event, day, targetIndex) {
    event.preventDefault();

    if (draggedIndex !== null && draggedDay !== null) {
        // Hämta det dragna elementet
        const draggedItem = toDoLists[draggedDay][draggedIndex];

        // Ta bort det dragna elementet från dess ursprungliga position
        toDoLists[draggedDay].splice(draggedIndex, 1);

        // Infoga det dragna elementet vid målets position
        toDoLists[day].splice(targetIndex, 0, draggedItem);

        // Uppdatera listorna
        uppdateraOutput(draggedDay);
        uppdateraOutput(day);

        // Spara ändringarna
        sparaTillLocalStorage();

        // Nollställ drag-data
        draggedIndex = null;
        draggedDay = null;
    }
}