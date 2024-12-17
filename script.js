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
        "<tr " +
        "draggable='true' " +
        "ondragstart='startDrag(event, " + i + ")' " +
        "ondragover='allowDrop(event)' " +
        "ondrop='drop(event, " + i + ")' " +
        "ontouchstart='startTouch(event, " + i + ")' " +  // Lägg till touchstart
        "ontouchmove='handleTouchMove(event)' " +          // Lägg till touchmove
        "ontouchend='drop(event, " + i + ")'>" +           // Lägg till touchend för drop
        "<td class='tdCheck'>" +
        "<label>" +
        "<input type='checkbox' " + (toDoToday[i].checked ? "checked" : "") + 
        " onchange='toggleChecked(" + i + ")' style='width: 100%; margin: 10px;'>" +
        "</label></td>" +
        "<td>" + toDoToday[i].name + "<div class='arrow-buttons'>" +
        "<button onclick='moveUp(" + i + ")'><i class='fa-solid fa-arrow-up'></i></button> " +
        "<button onclick='moveDown(" + i + ")'><i class='fa-solid fa-arrow-down'></i></button>" +
        "</div></td>" +
        "<td class='ikoner'>" +
        "<i class='fa-regular fa-pen-to-square' onclick='redigera(" + i + ")'></i>" +
        "<i class='fa-solid fa-trash' onclick='taBort(" + i + ")'></i>" +
        "</td></tr>";
    }
    document.getElementById("output").innerHTML = output;
}

function sparaTillLocalStorage() {
    localStorage.setItem("toDoToday", JSON.stringify(toDoToday));
}

function lasFranLocalStorage() {
    const sparadData = localStorage.getItem("toDoToday");
    if (sparadData) {
        toDoToday = JSON.parse(sparadData).map(task => {
            return {
                name: task.name || task, 
                checked: task.checked || false 
            };
        });
    }
}

function toggleMenu() {
    console.log("Hamburger clicked!");
    const sidenav = document.querySelector('.sidenav');
    sidenav.classList.toggle('active');
}

//Funktion så att det även sparas om man checkat för en checkbox
function toggleChecked(index) {
    toDoToday[index].checked = !toDoToday[index].checked; 
    sparaTillLocalStorage();
}

  // Funktion för att lägga till 
  function laggaTill() {
    let myInput = document.getElementById("myInput").value;
    if (myInput.length !== 0) {
        if (redigeradIndex === -1) {
            toDoToday.push({ name: myInput, checked: false }); // Lägg till som objekt
        } else {
            toDoToday[redigeradIndex].name = myInput; // Uppdatera endast namnet
            redigeradIndex = -1;
            document.getElementById("sparaKnapp").style.display = "none";
        }
        document.getElementById("myInput").value = "";
        uppdateraOutput();
        sparaTillLocalStorage();
    }
}

  //Funktion för att ta bort en task
  function taBort(id) {
    toDoToday.splice(id, 1); // Ta bort direkt utan temporär array
    uppdateraOutput();
    sparaTillLocalStorage(); // Spara till localStorage
}
  
  // Funktion för att redigera en task
  function redigera(id) {
    console.log("Redigera " + id);
    // om funktionen körs ändras id på den valda tasken till -1 för att man ska veta att det är ett redigerat index
    redigeradIndex = id;
    // Ladda den redigerade tasken i inputfältet
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
let touchStartIndex = null; // För att hålla reda på indexet där användaren började "dra"

function startDrag(event, index) {
    // Hantera både mus och touch
    if (event.type === 'touchstart') {
        touchStartIndex = index;
    } else {
        draggedIndex = index;
    }
    event.dataTransfer.effectAllowed = "move";
}

// Tillåt släpp på elementet
function allowDrop(event) {
    event.preventDefault();
}

// Funktion för att hantera släppning
function drop(event, targetIndex) {
    event.preventDefault();
  
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
        // Hämta det dragna elementet
        const draggedItem = toDoToday[draggedIndex];
        
        // Ta bort det dragna elementet från sin nuvarande position
        toDoToday.splice(draggedIndex, 1);
        
        // Infoga det dragna elementet vid den nya positionen
        toDoToday.splice(targetIndex, 0, draggedItem);
  
        // Uppdatera listan
        uppdateraOutput();
  
        // Nollställ drag-index
        draggedIndex = null;
    }
  
    if (touchStartIndex !== null && touchStartIndex !== targetIndex) {
        // Om vi hanterar touch-händelser
        const draggedItem = toDoToday[touchStartIndex];
        toDoToday.splice(touchStartIndex, 1);
        toDoToday.splice(targetIndex, 0, draggedItem);
        
        // Uppdatera listan och nollställ touch-start-index
        uppdateraOutput();
        touchStartIndex = null;
    }
}

// Hantera drag under rörelse på pekskärm (mobil)
function handleTouchMove(event) {
    event.preventDefault();
    if (touchStartIndex !== null) {
        // Här kan du lägga till logik för att visa en visuell indikator för dragning
    }
}

// Använd touch-händelser i stället för mus-händelser för mobiler
document.addEventListener('touchmove', handleTouchMove, { passive: false });


// Funktion för att uppdatera listan med pilar för att flytta upp/ned
function moveUp(index) {
    if (index > 0) {
        // Byt plats på aktuellt element och föregående
        var temp = toDoToday[index];
        toDoToday[index] = toDoToday[index - 1];
        toDoToday[index - 1] = temp;
        uppdateraOutput();
        sparaTillLocalStorage();
    }
}

function moveDown(index) {
    if (index < toDoToday.length - 1) {
        // Byt plats på aktuellt element och nästa
        var temp = toDoToday[index];
        toDoToday[index] = toDoToday[index + 1];
        toDoToday[index + 1] = temp;
        uppdateraOutput();
        sparaTillLocalStorage();
    }
}