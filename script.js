//Lägga till så att dagens datum visas i sidebaren
var now = new Date();
var date = now.toLocaleDateString(); // Ger endast datumet

// Lägg till datumet i HTML
document.getElementById("datetime").innerHTML = date;

var toDoToday = ["Städa", "plugga"];
var redigeradIndex = -1; // Variabel för att hålla reda på vilket namn som redigeras
//Läs in vid sidans start innehåll i local storage
lasFranLocalStorage();
uppdateraOutput();

//Funktion för att skriva ut arrayen i början
function uppdateraOutput() {
    var output = "";
    for (var i = 0; i < toDoToday.length; i++) {
        output +=
            "<tr draggable='true' ondragstart='startDrag(event, " + i + ")' ondragover='allowDrop(event)' ondrop='drop(event, " + i + ")'>" +
            "<td>" +
            "<label><input type='checkbox'>" +
           "</label>" + toDoToday[i] +
            "</td>" +
            "<td>" +
            "<i class='fa-regular fa-pen-to-square' onclick='redigera(" + i + ")'></i>" + " " +
            "<i class='fa-solid fa-trash' onclick='taBort(" + i + ")'></i>" +
            "</td>" +
            "</tr>";
    }
    document.getElementById("output").innerHTML = output;
}

function sparaTillLocalStorage() {
    localStorage.setItem("toDoToday", JSON.stringify(toDoToday));
}

function lasFranLocalStorage() {
    const sparadData = localStorage.getItem("toDoToday");
    if (sparadData) {
        toDoToday = JSON.parse(sparadData);
    }
}

function toggleMenu() {
    console.log("Hamburger clicked!");
    const sidenav = document.querySelector('.sidenav');
    sidenav.classList.toggle('active');
}

  // Funktion för att lägga till upp
  function laggaTill() {
    let myInput = document.getElementById("myInput").value;
    if (myInput.length !== 0) {
        if (redigeradIndex === -1) {
            toDoToday.push(myInput);
        } else {
            toDoToday[redigeradIndex] = myInput;
            redigeradIndex = -1;
            document.getElementById("sparaKnapp").style.display = "none";
        }
        document.getElementById("myInput").value = "";
        uppdateraOutput();
        sparaTillLocalStorage(); // Spara till localStorage
    }
}

  //Funktion för att ta bort en task
  function taBort(id) {
    toDoToday.splice(id, 1); // Ta bort direkt utan temporär array
    uppdateraOutput();
    sparaTillLocalStorage(); // Spara till localStorage
}
  
  // Funktion för att redigera ett namn
  function redigera(id) {
    console.log("Redigera " + id);
    // om funktionen körs ändras id på det valda namnet till -1 för att man ska veta att det är ett redigerat index
    redigeradIndex = id;
    // Ladda det redigerade namnet i inputfältet
    document.getElementById("myInput").value = toDoToday[id];
    // Visa "Spara"-knappen för att spara ändringar
    document.getElementById("sparaKnapp").style.display = "inline-block";
  }
  
  // Funktion för att spara ändringarna
  function sparaRedigering() {
    laggaTill(); // Använd samma funktion för att spara ändringar
  }
  
  //Funktion för att nollställa lista
  function rensa() {
    //Funktionen uppdaterar arrayen till en tom array
    toDoToday = [];
    uppdateraOutput();
  }

  //Skapar funktion för att kunna dra i sina todos och prioritera de 
let draggedIndex = null;

function startDrag(event, index) {
    draggedIndex = index;
    event.dataTransfer.effectAllowed = "move";
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, targetIndex) {
    event.preventDefault();

    if (draggedIndex !== null && draggedIndex !== targetIndex) {
        // Byt plats på uppgifterna
        const temp = toDoToday[draggedIndex];
        toDoToday[draggedIndex] = toDoToday[targetIndex];
        toDoToday[targetIndex] = temp;

        // Uppdatera listan
        uppdateraOutput();

        // Nollställ drag-index
        draggedIndex = null;
    }
}