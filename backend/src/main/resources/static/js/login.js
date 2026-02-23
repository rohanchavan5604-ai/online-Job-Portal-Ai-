async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert("Login failed: " + errorText);
            return;
        }

        const token = await response.text();
        localStorage.setItem("token", token);
        window.location.href = "jobs.html";

    } catch (error) {
        alert("Server not reachable. Is backend running?");
        console.error(error);
    }
}
