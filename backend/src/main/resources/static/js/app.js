async function login() {
    const email = document.getElementById("loginEmail")?.value;
    const password = document.getElementById("loginPassword")?.value;
    const message = document.getElementById("loginMessage");

    try {
        const response = await fetch("/api/auth/login", {
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
        const response = await fetch("/api/auth/register", {
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
        const response = await fetch("/api/jobs");
        const jobs = await response.json();

        container.innerHTML = "";

        jobs.forEach(job => {
            container.innerHTML += `
                <div class="job-card">
                    <h3>${job.title}</h3>
                    <p>${job.description}</p>
                    <p><b>Company:</b> ${job.company}</p>
                    <p><b>Location:</b> ${job.location}</p>
                    <p><b>Salary:</b> ₹${job.salary}</p>
                    <button onclick="applyJob(${job.id})">Apply</button>
                    <button onclick="deleteJob(${job.id})">Delete</button>
                </div>
            `;
        });

        

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Failed to load jobs</p>";
    }
}
async function deleteJob(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`/api/jobs/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (response.ok) {
            alert("Job deleted successfully");
            loadJobs();
        } else {
            alert("Failed to delete job");
        }

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
}

async function searchJobs() {
    const title = document.getElementById("searchTitle").value;
    const location = document.getElementById("searchLocation").value;
    const sortValue = document.getElementById("sortOption").value;

    let sortBy = "createdAt";
    let direction = "desc";

    if (sortValue === "salaryHigh") {
        sortBy = "salary";
        direction = "desc";
    } else if (sortValue === "salaryLow") {
        sortBy = "salary";
        direction = "asc";
    }

    let url = `/api/jobs/search?page=0&size=10&sortBy=${sortBy}&direction=${direction}`;

    if (title) url += `&title=${encodeURIComponent(title)}`;
    if (location) url += `&location=${encodeURIComponent(location)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const jobs = data.content || data;

        const container = document.getElementById("jobsContainer");
        container.innerHTML = "";

        if (!jobs || jobs.length === 0) {
            container.innerHTML = "<p>No jobs found</p>";
            return;
        }

        jobs.forEach(job => {
            container.innerHTML += `
                <div class="job-card">
                    <h3>${job.title}</h3>
                    <p>${job.description}</p>
                    <p><b>Company:</b> ${job.company}</p>
                    <p><b>Location:</b> ${job.location}</p>
                    <p><b>Salary:</b> ₹${job.salary}</p>
                    <button onclick="applyJob(${job.id})">Apply</button>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
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
        const response = await fetch(`/api/applications/apply/${jobId}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Application failed");
        }

        const data = await response.json();
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
        const response = await fetch("/api/applications/my", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const applications = await response.json();
        container.innerHTML = "";

        if (!applications.length) {
            container.innerHTML = "<p>No applications yet.</p>";
            return;
        }

        applications.forEach(app => {
            container.innerHTML += `
                <div class="application-card">
                    <h3>${app.job.title}</h3>
                    <p><b>Company:</b> ${app.job.company}</p>
                    <p><b>Location:</b> ${app.job.location}</p>
                    <p><b>Salary:</b> ₹${app.job.salary}</p>
                    <span class="status-badge status-${app.status}">
                        ${app.status}
                    </span>
                </div>
            `;
        });

    } catch (error) {
        container.innerHTML = "<p>Failed to load applications</p>";
    }
}

function goToMyApplications() {
    window.location.href = "my-applications.html";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

window.addEventListener("DOMContentLoaded", () => {
    loadJobs();
    loadMyApplications();
});
