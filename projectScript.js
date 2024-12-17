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
var projects = []; // Lista på alla projekt

// Läs in vid sidans start innehåll från localStorage
lasFranLocalStorage();
uppdateraOutput2();

// Läs in vid sidans start innehåll från localStorage
function lasFranLocalStorage() {
    const sparadData = localStorage.getItem("projects");
    if (sparadData) {
        projects = JSON.parse(sparadData);
        // Validera och korrigera varje projekt
        projects = projects.map(project => {
            if (typeof project === "string") {
                return { name: project, tasks: [] }; // Konvertera sträng till korrekt objekt
            } else if (typeof project.name !== "string") {
                return { name: "Nytt projekt", tasks: [] }; // Om name är ogiltigt, sätt fallback
            }
            return project; // Lämna korrekt projekt oförändrat
        });
    } else {
        projects = []; // Om ingen sparad data finns, börja med en tom array
    }
}
console.log(projects);

// Funktion för att spara till localStorage
function sparaTillLocalStorage() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

// Funktion för att skapa och lägga till ett nytt projekt
function laggaTill() {
    let projectName = document.getElementById("myInput").value; // Hämta värdet från inputfältet
    if (projectName.length !== 0) {
        // Skapa ett projekt med namnet från input och en tom tasks-array
        projects.push({
            name: projectName, // Här används input-värdet som projektets namn
            tasks: [] 
        });
        document.getElementById("myInput").value = ""; // Rensa inputfältet
        uppdateraOutput2(); // Uppdatera listan med projekt
        sparaTillLocalStorage(); // Spara till localStorage
    }
}

// Funktion för att uppdatera outputen av alla projekt
function uppdateraOutput2() {
    var output2 = "";
    for (var i = 0; i < projects.length; i++) {
        let projectName = projects[i].name || "Nytt projekt"; // Sätt fallback om name saknas
        output2 += `
            <div class='card4'>
                <div class='projectCol'>
                    <h2>${projectName}</h2>
                    <input type='text' id='projectInput${i}' placeholder='Task...'>
                    <button onclick='laggaTillProjectTask(${i})'>Add Task</button>
                    <ul id='outputProject${i}'>
                        ${getTasksHTML(i)}
                    </ul>
                </div>
            </div>
        `;
    }
    document.getElementById("output2").innerHTML = output2;
}


// Funktion för att skapa HTML för tasks i varje projekt
function getTasksHTML(projectIndex) {
    var taskHTML = "";
    
    // Kolla om projektet och tasks finns
    if (projects[projectIndex] && Array.isArray(projects[projectIndex].tasks)) {
        for (var j = 0; j < projects[projectIndex].tasks.length; j++) {
            taskHTML += `
                <li>
                    <input type='checkbox'>
                    ${projects[projectIndex].tasks[j]}
                    <i class='fa-regular fa-pen-to-square' onclick='redigeraTask(${projectIndex}, ${j})'></i>
                    <i class='fa-solid fa-trash' onclick='taBortTask(${projectIndex}, ${j})'></i>
                </li>
            `;
        }
    }
    return taskHTML;
}

// Funktion för att lägga till en task till ett projekt
function laggaTillProjectTask(projectIndex) {
    console.log("projectIndex:", projectIndex);
    console.log("projects:", projects);
    console.log("projects[projectIndex]:", projects[projectIndex]);

    let taskInput = document.getElementById(`projectInput${projectIndex}`).value;
    if (taskInput.length !== 0) {
        // Lägg till task till rätt projekt
        projects[projectIndex].tasks.push(taskInput);
        document.getElementById(`projectInput${projectIndex}`).value = ""; // Rensa inputfältet
        uppdateraOutput2(); // Uppdatera alla projekt
        sparaTillLocalStorage(); // Spara till localStorage
    }
}

// Funktion för att ta bort en task från ett projekt
function taBortTask(projectIndex, taskIndex) {
    projects[projectIndex].tasks.splice(taskIndex, 1); // Ta bort tasken från listan
    uppdateraOutput2(); // Uppdatera listan med projekt och tasks
    sparaTillLocalStorage(); // Spara till localStorage
}

// Funktion för att redigera en task i ett projekt
function redigeraTask(projectIndex, taskIndex) {
    let newTask = prompt("Edit task", projects[projectIndex].tasks[taskIndex]);
    if (newTask !== null) {
        projects[projectIndex].tasks[taskIndex] = newTask; // Uppdatera task
        uppdateraOutput2(); // Uppdatera output
        sparaTillLocalStorage(); // Spara till localStorage
    }
}