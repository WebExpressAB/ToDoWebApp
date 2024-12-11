//Lägga till så att dagens datum visas i sidebaren
var now = new Date();
var date = now.toLocaleDateString(); // Ger endast datumet

// Lägg till datumet i HTML
document.getElementById("datetime").innerHTML = date;


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
            <li><label><input type='checkbox' style='width: 100%; margin: 0px;'>
           </label>
                ${item}
                <i class='fa-regular fa-pen-to-square' onclick='redigera("${day}", ${index})'></i>
                <i class='fa-solid fa-trash' onclick='taBort("${day}", ${index})'></i>
            </li>
        `;
        ;
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

function redigera(day, index) {
    let inputId = `${day.toLowerCase()}Input`;
    document.getElementById(inputId).value = toDoLists[day][index];
    toDoLists[day].splice(index, 1);
    uppdateraOutput(day);
    sparaTillLocalStorage(); // Spara ändringarna
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