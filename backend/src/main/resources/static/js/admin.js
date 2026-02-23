async function loadDashboard() {

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5604/api/admin/stats", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById("totalJobs").innerText = data.totalJobs;
        document.getElementById("totalUsers").innerText = data.totalUsers;
        document.getElementById("totalApplications").innerText = data.totalApplications;
    } else {
        alert("Access denied");
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

loadDashboard();
