const BASE_URL = "http://localhost:8080";

function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "jobs.html";
        } else {
            document.getElementById("loginMessage").innerText = data.message || "Login failed";
        }
    })
    .catch(() => {
        document.getElementById("loginMessage").innerText = "Login failed";
    });
}

function register() {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password,
            role: "USER"
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            document.getElementById("registerMessage").innerText = data.message;
        } else {
            alert("Registration successful!");
            window.location.href = "login.html";
        }
    })
    .catch(() => {
        document.getElementById("registerMessage").innerText = "Registration failed";
    });
}

function loadJobs() {
    const container = document.getElementById("jobsContainer");
    if (!container) return;

    fetch(`${BASE_URL}/api/jobs`)
    .then(res => res.json())
    .then(jobs => {
        container.innerHTML = "";

        jobs.forEach(job => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h4>${job.title}</h4>
                <p>${job.description}</p>
                <p><b>Company:</b> ${job.company}</p>
                <p><b>Location:</b> ${job.location}</p>
                <button onclick="applyJob(${job.id})">Apply</button>
                <hr>
            `;
            container.appendChild(div);
        });
    });
}

function applyJob(jobId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    fetch(`${BASE_URL}/api/applications/${jobId}`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw err; });
        }
        return res.json();
    })
    .then(() => {
        alert("Applied successfully!");
    })
    .catch(err => {
        alert(err.message || "Application failed");
    });
}

function loadMyApplications() {
    const container = document.getElementById("applicationsContainer");
    if (!container) return;

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch(`${BASE_URL}/api/applications/my`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(applications => {
        container.innerHTML = "";

        applications.forEach(app => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h4>${app.job.title}</h4>
                <p><b>Company:</b> ${app.job.company}</p>
                <p><b>Status:</b> ${app.status}</p>
                <hr>
            `;
            container.appendChild(div);
        });
    });
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

window.onload = function () {

    if (document.getElementById("jobsContainer")) {
        loadJobs();
    }

    if (document.getElementById("applicationsContainer")) {
        loadMyApplications();
    }
};
