const BASE_URL = "http://localhost:8080";

async function login() {
    const email = document.getElementById("loginEmail")?.value;
    const password = document.getElementById("loginPassword")?.value;
    const message = document.getElementById("loginMessage");

    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem("token", data.token);
        window.location.href = "jobs.html";

    } catch (error) {
        if (message) message.innerText = error.message;
    }
}

async function register() {
    const name = document.getElementById("registerName")?.value;
    const email = document.getElementById("registerEmail")?.value;
    const password = document.getElementById("registerPassword")?.value;
    const message = document.getElementById("registerMessage");

    try {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role: "USER" })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Registration failed");

        alert("Registration successful!");
        window.location.href = "login.html";

    } catch (error) {
        if (message) message.innerText = error.message;
    }
}

async function loadJobs() {
    const container = document.getElementById("jobsContainer");
    if (!container) return;

    try {
        const response = await fetch(`${BASE_URL}/api/jobs`);
        const jobs = await response.json();

        container.innerHTML = "";

        jobs.forEach(job => {
            const div = document.createElement("div");
            div.className = "job-card";
            div.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p><b>Company:</b> ${job.company}</p>
                <p><b>Location:</b> ${job.location}</p>
                <button onclick="applyJob(${job.id})">Apply</button>
            `;
            container.appendChild(div);
        });

    } catch {
        container.innerHTML = "<p>Failed to load jobs</p>";
    }
}

async function applyJob(jobId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/applications/${jobId}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Application failed");

        alert("Applied successfully!");

    } catch (error) {
        alert(error.message);
    }
}

async function loadMyApplications() {
    const container = document.getElementById("applicationsContainer");
    if (!container) return;

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/applications/my`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const applications = await response.json();

        container.innerHTML = "";

        applications.forEach(app => {
            const div = document.createElement("div");
            div.className = "application-card";
            div.innerHTML = `
                <h3>${app.job.title}</h3>
                <p><b>Company:</b> ${app.job.company}</p>
                <p><b>Status:</b> ${app.status}</p>
            `;
            container.appendChild(div);
        });

    } catch {
        container.innerHTML = "<p>Failed to load applications</p>";
    }
}

function goToMyApplications() {
    window.location.href = "my-applications.html";
}

function goToJobs() {
    window.location.href = "jobs.html";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

window.addEventListener("DOMContentLoaded", () => {
    loadJobs();
    loadMyApplications();
});
