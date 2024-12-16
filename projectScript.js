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
            "<h2>" + projects[i] + "<h2/>" + " <input type='text' placeholder='Task...'>" + " <button>Add</button>" + "</div>" +"</div>"
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