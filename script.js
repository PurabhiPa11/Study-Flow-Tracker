let planned = 0;
let completed = 0;

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

function updateWork() {
    completed = parseInt(document.getElementById("completedHours").value);
    updateProgress();
}

function updateProgress() {
    if (!planned) return;

    let percent = Math.min((completed / planned) * 100, 100);

    let circle = document.getElementById("circleProgress");
    let offset = 314 - (314 * percent) / 100;
    circle.style.strokeDashoffset = offset;

    document.getElementById("percent").innerText = Math.floor(percent) + "%";

    let msg = "";

    if (percent < 30) msg = " Start pushing!";
    else if (percent < 70) msg = " Good progress!";
    else if (percent < 100) msg = " Almost there!";
    else msg = "🎉 Completed!";

    document.getElementById("message").innerText = msg;
}