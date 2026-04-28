async function postJob() {

    const token = localStorage.getItem("token");

    const title = document.getElementById("title").value;
    const company = document.getElementById("company").value;
    const salary = document.getElementById("salary").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    try {

        const response = await fetch("/api/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                title: title,
                company: company,
                salary: salary,
                location: location,
                description: description
            })
        });

        if (response.ok) {
            alert("Job posted successfully!");
            window.location.href = "admin-dashboard.html";
        } else {
            alert("Failed to post job");
        }

    } catch (error) {
        console.error(error);
        alert("Server error");
    }

}