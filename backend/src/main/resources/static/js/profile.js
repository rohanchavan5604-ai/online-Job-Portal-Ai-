document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("/api/users", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const users = await response.json();

        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.sub;

        const currentUser = users.find(user => user.email === email);

        if (currentUser) {
            document.getElementById("name").innerText = currentUser.fullName;
            document.getElementById("email").innerText = currentUser.email;
            document.getElementById("role").innerText = currentUser.role;
        }

    } catch (error) {
        console.error("Profile error:", error);
    }

});