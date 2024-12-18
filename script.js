// Lägger till dagens datum i sidebaren
var now = new Date();
var date = now.toLocaleDateString(); // Ger endast datumet

// Lägg till datumet i HTML
document.getElementById("datetime").innerHTML = date;

var toDoToday = [
    { name: "Städa", checked: false },
    { name: "Plugga", checked: false }
];
var redigeradIndex = -1; // Variabel för att hålla reda på vilket namn som redigeras
var draggedIndex = null; // För mus-händelser
var touchStartIndex = null; // För att hålla reda på indexet där användaren började "dra"
var touchTarget = null; // För att hålla referens till den berörda raden

// Läs in vid sidans start innehåll i local storage
lasFranLocalStorage();
uppdateraOutput();

// Funktion för att skriva ut arrayen i början
function uppdateraOutput() {
    let output = "";
    for (let i = 0; i < toDoToday.length; i++) {
        const uniqueId = `task-${i}`; // Skapa ett unikt ID för varje rad
        output += `
        <tr id="${uniqueId}" draggable="true" 
            ondragstart="startDrag(event, ${i})" 
            ondragover="allowDrop(event)" 
            ondrop="drop(event, ${i})" 
            ontouchstart="startTouch(event, ${i})" 
            ontouchmove="handleTouchMove(event)" 
            ontouchend="endTouch(event)">
            <td class="tdCheck">
                <label>
                    <input type="checkbox" ${toDoToday[i].checked ? "checked" : ""} 
                        onchange="toggleChecked(${i})" style="width: 100%; margin: 10px;">
                </label>
            </td>
            <td>${toDoToday[i].name}</td>
            <td class="ikoner">
                <i class="fa-regular fa-pen-to-square" onclick="redigera(${i})"></i>
                <i class="fa-solid fa-trash" onclick="taBort(${i})"></i>
            </td>
        </tr>`;
    }
    document.getElementById("output").innerHTML = output;
}

var output = document.getElementById("output"); 
output.addEventListener("click", function(e) {
    if(e.target.tagName === "TD") {
        e.target.classList.toggle("checked");
    }
})

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
    const sidenav = document.querySelector('.sidenav');
    sidenav.classList.toggle('active');
}

// Funktion så att det även sparas om man checkat för en checkbox
function toggleChecked(index) {
    toDoToday[index].checked = !toDoToday[index].checked; 
    sparaTillLocalStorage();
}

// Funktion för att lägga till en task
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

// Funktion för att ta bort en task
function taBort(id) {
    toDoToday.splice(id, 1); // Ta bort direkt utan temporär array
    uppdateraOutput();
    sparaTillLocalStorage(); // Spara till localStorage
}

// Funktion för att redigera en task
function redigera(id) {
    redigeradIndex = id;
    document.getElementById("myInput").value = toDoToday[id].name;
    document.getElementById("sparaKnapp").style.display = "inline-block";
}

// Funktion för att spara ändringarna
function sparaRedigering() {
    laggaTill(); // Använd samma funktion för att spara ändringar
}

// Funktion för att nollställa lista
function rensa() {
    toDoToday = [];
    uppdateraOutput();
}

// Funktioner för att hantera drag and drop (både mus och touch)

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
        const draggedItem = toDoToday[draggedIndex];
        toDoToday.splice(draggedIndex, 1);
        toDoToday.splice(targetIndex, 0, draggedItem);

        uppdateraOutput();
        sparaTillLocalStorage();
        draggedIndex = null;
    }
}

// Touch-funktioner
function startTouch(event, index) {
    touchStartIndex = index;
    touchTarget = document.getElementById(`task-${index}`);
    touchStartY = event.targetTouches[0].pageY; // Spara startpositionen för touch
}

function handleTouchMove(event) {
    if (!touchTarget) return;

    const touchLocation = event.targetTouches[0];
    touchTarget.style.position = "absolute";
    touchTarget.style.zIndex = "1000"; // Placera den över andra element
    touchTarget.style.top = touchLocation.pageY + "px"; // Flytta vertikalt

    // Kolla om elementet ska byta plats med ett annat element
    const targetRow = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
    );

    if (targetRow && targetRow.tagName === "TR") {
        const newIndex = Array.from(targetRow.parentNode.children).indexOf(targetRow);

        if (touchStartIndex !== newIndex) {
            const draggedItem = toDoToday[touchStartIndex];
            toDoToday.splice(touchStartIndex, 1);
            toDoToday.splice(newIndex, 0, draggedItem);

            // Uppdatera och spara listan
            uppdateraOutput();
            sparaTillLocalStorage();
            touchStartIndex = null;
        }
    }
}

function endTouch(event, targetIndex) {
    if (!touchTarget) return;

    touchTarget.style.position = "";
    touchTarget.style.zIndex = "";
    touchTarget.style.top = "";
    touchTarget = null;
    touchStartIndex = null;
}

// Lägg till touchmove som passiv
document.addEventListener('touchmove', handleTouchMove, { passive: true });

// Initial laddning av sidan
uppdateraOutput();