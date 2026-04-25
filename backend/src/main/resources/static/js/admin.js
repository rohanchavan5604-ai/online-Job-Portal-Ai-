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

if (!token) {
redirectToLogin();
return;
}

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
<td>${app.user?.fullName || "N/A"}</td>
<td>${app.user?.email || "N/A"}</td>
<td>${app.job?.title || "N/A"}</td>
<td class="status ${app.status?.toLowerCase()}">${app.status || "N/A"}</td>
<td>
<button onclick="updateStatus(${app.id}, 'SHORTLISTED')" class="btn-shortlist">Shortlist</button>
<button onclick="updateStatus(${app.id}, 'INTERVIEW_SCHEDULED')" class="btn-interview">Interview</button>
<button onclick="updateStatus(${app.id}, 'HIRED')" class="btn-hire">Hire</button>
<button onclick="updateStatus(${app.id}, 'REJECTED')" class="btn-reject">Reject</button>
</td>
`;

table.appendChild(row);

});

} catch (error) {

console.error("Applications error:", error);

}

}

async function updateStatus(id, status) {

const token = localStorage.getItem("token");

try {

const response = await fetch(`/api/applications/${id}/status`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
"Authorization": "Bearer " + token
},
body: JSON.stringify({ status: status })
});

if (!response.ok) {
throw new Error("Failed to update status");
}

loadApplications();

} catch (error) {

console.error("Status update error:", error);

}

}

async function loadUsers() {

const token = localStorage.getItem("token");

if (!token) {
redirectToLogin();
return;
}

try {

const response = await fetch("/api/users", {
method: "GET",
headers: {
"Authorization": "Bearer " + token
}
});

if (!response.ok) {
throw new Error("Failed to load users");
}

const users = await response.json();

const table = document.getElementById("usersTableBody");

if (!table) return;

table.innerHTML = "";

users.forEach(user => {

const row = document.createElement("tr");

row.innerHTML = `
<td>${user.id}</td>
<td>${user.fullName}</td>
<td>${user.email}</td>
<td>${user.role}</td>
`;

table.appendChild(row);

});

} catch (error) {

console.error("Users error:", error);

}

}

function updateField(id, value) {

const element = document.getElementById(id);

if (element) {
element.innerText = value ?? 0;
}

}

function logout() {

localStorage.removeItem("token");
localStorage.removeItem("role");
window.location.href = "login.html";

}

function redirectToLogin() {

localStorage.clear();
window.location.href = "login.html";

}

window.addEventListener("DOMContentLoaded", () => {

loadDashboard();
loadApplications();
loadUsers();

});