// Lägga till så att dagens datum visas i sidebaren
document.getElementById("datetime").innerHTML = new Date().toLocaleDateString();

// Funktion för hamburgermeny
function toggleMenu() {
    document.querySelector('.sidenav').classList.toggle('active');
}

// Hämta alla länkar med klassen "sideA" och lägg till active-hantering
var sideLinks = document.getElementsByClassName("sideA");
for (var i = 0; i < sideLinks.length; i++) {
    sideLinks[i].addEventListener("click", function(event) {
        event.preventDefault();
        Array.from(sideLinks).forEach(link => link.classList.remove("active"));
        this.classList.add("active");
        window.location.href = this.href;
    });
}

var projects = []; // Lista på alla projekt
var draggedTask = { projectIndex: null, taskIndex: null }; // För drag & drop

// Läs in projekt från localStorage vid start
lasFranLocalStorage();
uppdateraOutput2();

// Läs in projekt från localStorage vid start
function lasFranLocalStorage() {
    const sparadData = localStorage.getItem("projects");
    projects = sparadData
        ? JSON.parse(sparadData).map(project => ({
              name: project.name || "",
              tasks: project.tasks.map(task => 
                  typeof task === "string" ? { task, checked: false } : task
              )
          }))
        : [];
}

// Spara till localStorage
function sparaTillLocalStorage() {
    localStorage.setItem("projects", JSON.stringify(projects));
}
// Lägg till ett nytt projekt
function laggaTill() {
    const projectName = document.getElementById("myInput").value.trim();
    if (projectName) {
        projects.push({ name: projectName, tasks: [] });
        document.getElementById("myInput").value = "";
        uppdateraOutput2();
        sparaTillLocalStorage();
    }
}

// Uppdatera outputen av alla projekt
function uppdateraOutput2() {
    document.getElementById("output2").innerHTML = projects.map((project, i) => `
        <div class='card4'>
            <div class='projectCol'>
                <i class='fa-solid fa-trash Kasta' onClick='taBortProjekt(${i})'></i>
                <p class='KastaHide'>Delete project</p>
                <h2>${project.name || "Nytt projekt"}</h2>
                <div class='todo-app'>
                <input type='text' id='projectInput${i}' class='projectInput' placeholder='Task...'>
                <button onclick='laggaTillProjectTask(${i})'>Add Task</button>
                </div>
                  <ul id='outputProject${i}'>
                    ${getTasksHTML(i)}
                </ul>
        
            </div>
        </div>
    `).join("");
}

// Skapa HTML för tasks i ett projekt
function getTasksHTML(projectIndex) {
    return projects[projectIndex]?.tasks.map((taskObj, taskIndex) => `
        <li 
            draggable='true' 
            class='${taskObj.checked ? "checked" : ""}'
            onclick='toggleTaskChecked(${projectIndex}, ${taskIndex})'
            ondragstart='startDrag(event, ${projectIndex}, ${taskIndex})' 
            ondragover='allowDrop(event)' 
            ondrop='drop(event, ${projectIndex}, ${taskIndex})'>
            ${taskObj.task}
            <div class='arrow-buttons'>
                <button onclick='moveUp(${projectIndex}, ${taskIndex})'><i class='fa-solid fa-arrow-up'></i></button>
                <button onclick='moveDown(${projectIndex}, ${taskIndex})'><i class='fa-solid fa-arrow-down'></i></button>
            </div>
            <i class='fa-regular fa-pen-to-square' onclick='redigeraTask(${projectIndex}, ${taskIndex})'></i>
            <span class='delete' onclick='taBortTask(${projectIndex}, ${taskIndex})'>\u00D7</span>
        </li>
    `).join("") || "";
}

function toggleTaskChecked(projectIndex, taskIndex) {
    // Toggla "checked"-status
    projects[projectIndex].tasks[taskIndex].checked = 
        !projects[projectIndex].tasks[taskIndex].checked;

    // Uppdatera gränssnittet och spara till localStorage
    uppdateraOutput2();
    sparaTillLocalStorage();
}

document.getElementById("output2").addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        // Uppdatera status i din projektlista
        const projectIndex = Array.from(document.querySelectorAll('.card4')).indexOf(e.target.closest('.card4'));
        const taskIndex = Array.from(e.target.parentNode.children).indexOf(e.target);
        if (projectIndex >= 0 && taskIndex >= 0) {
            projects[projectIndex].tasks[taskIndex].checked = e.target.classList.contains("checked");
            sparaTillLocalStorage(); // Uppdatera localStorage
        }
    }
});
// Markera och ta bort en uppgift
/*listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.classList.contains("delete")) {
        e.target.parentElement.remove();
        saveData();
    }
}, false);*/
// Lägg till en task till ett projekt
function laggaTillProjectTask(projectIndex) {
    const taskInput = document.getElementById(`projectInput${projectIndex}`).value.trim();
    if (taskInput) {
        projects[projectIndex].tasks.push({ task: taskInput, checked: false });
        document.getElementById(`projectInput${projectIndex}`).value = "";
        uppdateraOutput2();
        sparaTillLocalStorage();
    }
}

//Funktion för att spara om man checkat en checkbox i localstorage
function toggleCheckbox(projectIndex, taskIndex, checkbox) {
    projects[projectIndex].tasks[taskIndex].checked = checkbox.checked;
    sparaTillLocalStorage();
}

// Ta bort en task från ett projekt
function taBortTask(projectIndex, taskIndex) {
    event.stopPropagation(); 
    projects[projectIndex].tasks.splice(taskIndex, 1);
    uppdateraOutput2();
    sparaTillLocalStorage();
}


//Ta bort ett projekt 
function taBortProjekt(index) {
    projects.splice(index, 1);
    uppdateraOutput2();
    sparaTillLocalStorage();
}

// Redigera en task i ett projekt
function redigeraTask(projectIndex, taskIndex) {
    event.stopPropagation(); 
    const newTask = prompt("Edit task", projects[projectIndex].tasks[taskIndex].task);
    if (newTask !== null) {
        projects[projectIndex].tasks[taskIndex].task = newTask.trim();
        uppdateraOutput2();
        sparaTillLocalStorage();
    }
}

// Drag & Drop-funktioner
function startDrag(event, projectIndex, taskIndex) {
    draggedTask = { projectIndex, taskIndex };
    event.dataTransfer.effectAllowed = "move";
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, targetProjectIndex, targetTaskIndex) {
    event.preventDefault();
    const { projectIndex, taskIndex } = draggedTask;

    if (projectIndex === targetProjectIndex && taskIndex !== targetTaskIndex) {
        const task = projects[projectIndex].tasks.splice(taskIndex, 1)[0];
        projects[projectIndex].tasks.splice(targetTaskIndex, 0, task);
        uppdateraOutput2();
        sparaTillLocalStorage();
    }
    draggedTask = { projectIndex: null, taskIndex: null };
}

function moveUp(projectIndex, taskIndex) {
    if (taskIndex > 0) {
        [projects[projectIndex].tasks[taskIndex], projects[projectIndex].tasks[taskIndex - 1]] = 
        [projects[projectIndex].tasks[taskIndex - 1], projects[projectIndex].tasks[taskIndex]];
        uppdateraOutput2();
        sparaTillLocalStorage();
    }
}

function moveDown(projectIndex, taskIndex) {
    if (taskIndex < projects[projectIndex].tasks.length - 1) {
        [projects[projectIndex].tasks[taskIndex], projects[projectIndex].tasks[taskIndex + 1]] = 
        [projects[projectIndex].tasks[taskIndex + 1], projects[projectIndex].tasks[taskIndex]];
        uppdateraOutput2();
        sparaTillLocalStorage();
    }
}