let tasks = [];
let selectedType = "Study";

function startApp() {
    let name = document.getElementById("name").value;
    if (!name) return;

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("welcome").innerText = "Hey, " + name + " 👋";
}

function selectType(el) {
    document.querySelectorAll(".cat").forEach(c => c.classList.remove("active"));
    el.classList.add("active");
    selectedType = el.innerText;
}

function addTask() {
    let name = document.getElementById("taskName").value;
    let hours = parseInt(document.getElementById("taskHours").value);

    if (!name || !hours) return;

    tasks.push({
        name,
        hours,
        type: selectedType,
        done: false
    });

    renderTasks();
    updateProgress();

    document.getElementById("taskName").value = "";
}

function renderTasks() {
    let container = document.getElementById("taskList");
    container.innerHTML = "";

    tasks.forEach((t, i) => {
        let div = document.createElement("div");
        div.className = "task";
        if (t.done) div.classList.add("done");

        div.innerHTML = `
            <div class="circle-check" onclick="toggleTask(${i})"></div>
            <div>
                <strong>${t.name}</strong>
                <div>${t.type} • ${t.hours} hrs</div>
            </div>
        `;

        container.appendChild(div);
    });
}

function toggleTask(i) {
    tasks[i].done = !tasks[i].done;
    renderTasks();
    updateProgress();
}

function updateProgress() {
    let total = tasks.reduce((s, t) => s + t.hours, 0);
    let done = tasks.filter(t => t.done).reduce((s, t) => s + t.hours, 0);

    let percent = total ? (done / total) * 100 : 0;

    let circle = document.getElementById("circleProgress");
    let offset = 377 - (377 * percent) / 100;
    circle.style.strokeDashoffset = offset;

    document.getElementById("percent").innerText = Math.floor(percent) + "%";

    let msg = "Start your day";
    if (percent > 20) msg = "Good start 🚀";
    if (percent > 50) msg = "You're doing great 🔥";
    if (percent > 80) msg = "Almost done 💪";
    if (percent === 100) msg = "Perfect day 🎉";

    document.getElementById("message").innerText = msg;
}