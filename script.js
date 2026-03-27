let totalHours = 0;
let streak = 1;

function addStudy() {
    let subject = document.getElementById("subject").value;
    let hours = parseInt(document.getElementById("hours").value);

    if (!subject || !hours) return;

    // Add to list
    let li = document.createElement("li");
    li.innerText = subject + " - " + hours + " hrs";
    document.getElementById("list").appendChild(li);

    // Update total
    totalHours += hours;
    document.getElementById("total").innerText = totalHours;

    // Update progress (goal = 10 hrs)
    let progress = Math.min((totalHours / 10) * 100, 100);
    document.getElementById("progress").style.width = progress + "%";

    // Simple streak logic
    if (hours > 0) {
        streak++;
        document.getElementById("streak").innerText = streak;
    }

    // Clear inputs
    document.getElementById("subject").value = "";
    document.getElementById("hours").value = "";
}