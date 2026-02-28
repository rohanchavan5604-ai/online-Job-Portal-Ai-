async function loadDashboard() {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "ADMIN") {
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch("/api/admin/stats", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Unauthorized or server error");
        }

        const data = await response.json();

        updateField("totalJobs", data.totalJobs);
        updateField("totalUsers", data.totalUsers);
        updateField("totalApplications", data.totalApplications);
        updateField("totalApplied", data.totalApplied);
        updateField("totalShortlisted", data.totalShortlisted);
        updateField("totalInterviewScheduled", data.totalInterviewScheduled);
        updateField("totalInterviewed", data.totalInterviewed);
        updateField("totalOffered", data.totalOffered);
        updateField("totalHired", data.totalHired);
        updateField("totalRejected", data.totalRejected);

    } catch (error) {
        console.error("Dashboard error:", error);
        redirectToLogin();
    }
}

async function loadApplications() {

    const token = localStorage.getItem("token");

    try {
        const response = await fetch("/api/applications", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load applications");
        }

        const data = await response.json();
        const table = document.getElementById("applicationsTable");

        if (!table) return;

        table.innerHTML = "";

        data.forEach(app => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${app.userEmail}</td>
                <td>${app.userEmail}</td>
                <td>${app.jobTitle}</td>
                <td>${app.status}</td>
                <td>-</td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Applications error:", error);
    }
}

function updateField(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = value ?? 0;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function redirectToLogin() {
    localStorage.clear();
    window.location.href = "login.html";
}

window.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
    loadApplications();
});