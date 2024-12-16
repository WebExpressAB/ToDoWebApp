//Lägga till så att dagens datum visas i sidebaren
var now = new Date();
var date = now.toLocaleDateString(); // Ger endast datumet

// Lägg till datumet i HTML
document.getElementById("datetime").innerHTML = date;

//Funktion för hamburgermeny
function toggleMenu() {
    console.log("Hamburger clicked!");
    const sidenav = document.querySelector('.sidenav');
    sidenav.classList.toggle('active');
}

// Hämta alla länkar med klassen "sideA"
var sideLinks = document.getElementsByClassName("sideA");

// Loop genom alla länkar
for (var i = 0; i < sideLinks.length; i++) {
    sideLinks[i].addEventListener("click", function(event) {
        // Förhindra att länken faktiskt följer sin standardhandling (navigerar)
        event.preventDefault();

        // Ta bort 'active' från alla länkar
        for (var j = 0; j < sideLinks.length; j++) {
            sideLinks[j].classList.remove("active");
        }
        
        // Lägg till 'active' på den länk som klickades på
        this.classList.add("active");

        // Navigera till den länkade sidan efter att ha lagt till 'active'
        window.location.href = this.href;
    });
}
var projects = [];

//Läs in vid sidans start innehåll i local storage
lasFranLocalStorage();
uppdateraOutput();

//Funktion för att skriva ut arrayen i början
function uppdateraOutput() {
    var output = "";
    for (var i = 0; i < projects.length; i++) {
        output += 
        "   <div class='card4'>" +
        "<div class='projectCol'>" +
            "<h2>" + projects[i] + "<h2/>" + " <input type='text' id='projectInput${i}' placeholder='Task...'>" + " <button onclick='laggaTillProjectTask(${i})'>Add</button>" + "<ul id='outputProject${i}'>" + "</ul>" +"</div>" + "</div>"
    }
    document.getElementById("output").innerHTML = output;
}
function sparaTillLocalStorage() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

function lasFranLocalStorage() {
    const sparadData = localStorage.getItem("projects");
    if (sparadData) {
        projects = JSON.parse(sparadData);
    }
}

  // Funktion för att lägga till 
  function laggaTill() {
    let myInput = document.getElementById("myInput").value;
    if (myInput.length !== 0) {
            projects.push(myInput);
        
        document.getElementById("myInput").value = "";
        uppdateraOutput();
        sparaTillLocalStorage(); // Spara till localStorage
    }
}

//Funktion för att skriva ut arrayen i början
function uppdateraProjectOutput(projectIndex) {
    var outputProject = "";
    for (var j = 0; j < projects[projectIndex].tasks.length; j++) {
        outputProject += `
               <li>
                <input type='checkbox'>
                ${projects[projectIndex].tasks[j]}
                <i class='fa-regular fa-pen-to-square' onclick='redigera("${projectIndex}", ${j})'></i>
                <i class='fa-solid fa-trash' onclick='taBortTask("${projectIndex}", ${j})'></i>
            </li>
        `;

    }
    document.getElementById("outputProject").innerHTML = outputProject;
}
function sparaTillLocalStorage() {
    localStorage.setItem("projects[i]", JSON.stringify(projects[i]));
}

  // Funktion för att lägga till 
  function laggaTillProjectTask() {
    let projectInput = document.getElementById("projectInput").value;
    if (projectInput.length !== 0) {
            projects[i].push(projectInput);
        
        document.getElementById("projectInput").value = "";
        uppdateraprojectOutput();
        sparaTillLocalStorage(); // Spara till localStorage
    }
}