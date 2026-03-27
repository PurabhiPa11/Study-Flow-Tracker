let planned = 0;
let completed = 0;
let tasks = [];
let streak = 0;

function startApp() {
    let name = document.getElementById("name").value;

    if (!name) return;

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    document.getElementById("welcome").innerText = "Welcome, " + name + " ";
}

function setPlan() {
    planned = parseInt(document.getElementById("plannedHours").value);
    updateProgress();
}

function addTask() {
    let name = document.getElementById("taskName").value;
    let type = document.getElementById("taskType").value;

    if (!name) return;

    tasks.push({
        name,
        type,
        done: false
    });

    renderTasks();
    document.getElementById("taskName").value = "";
}

function renderTasks() {
    let container = document.getElementById("taskList");
    container.innerHTML = "";

    let icons = {
        Study: "📘",
        Assignment: "📝",
        Project: "💻",
        Presentation: "📊"
    };

    tasks.forEach((task, index) => {
        let div = document.createElement("div");
        div.className = "task";

        if (task.done) div.classList.add("done");

        div.innerHTML = `
            <span>${icons[task.type]} ${task.name}</span>
            <button onclick="toggleTask(${index})">✔</button>
        `;

        container.appendChild(div);
    });
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;

    if (tasks[index].done) {
        completed++;
    } else {
        completed--;
    }

    updateProgress();
    renderTasks();
    checkStreak();
}

function updateProgress() {
    if (!planned) return;

    let percent = Math.min((completed / planned) * 100, 100);

    let circle = document.getElementById("circleProgress");
    let offset = 314 - (314 * percent) / 100;
    circle.style.strokeDashoffset = offset;

    document.getElementById("percent").innerText = Math.floor(percent) + "%";

    let msg = "";

    if (percent < 30) msg = "🚀 Start pushing!";
    else if (percent < 70) msg = " Good progress!";
    else if (percent < 100) msg = " Almost there!";
    else msg = "🎉 Completed!";

    document.getElementById("message").innerText = msg;
}

function checkStreak() {
    let allDone = tasks.length > 0 && tasks.every(t => t.done);

    if (allDone) {
        streak++;
        document.getElementById("streak").innerText = streak;
    }
}