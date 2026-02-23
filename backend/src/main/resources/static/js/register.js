tsParticles.load("tsparticles", {
    background: { color: "transparent" },
    fpsLimit: 60,
    particles: {
        number: { value: 60 },
        color: { value: "#38bdf8" },
        shape: { type: "circle" },
        opacity: { value: 0.6 },
        size: { value: { min: 1, max: 3 } },
        links: {
            enable: true,
            distance: 130,
            color: "#38bdf8",
            opacity: 0.3,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            outModes: { default: "out" }
        }
    }
});

document.getElementById("registerForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert("Registration failed: " + errorText);
            return;
        }

        alert("Registration successful");
        window.location.href = "login.html";

    } catch (error) {
        alert("Server not reachable");
        console.error(error);
    }
});