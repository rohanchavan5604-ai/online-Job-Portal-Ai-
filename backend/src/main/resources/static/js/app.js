/* =====================================================
   LOGIN
===================================================== */

async function login() {

    const email =
        document.getElementById("loginEmail")?.value;

    const password =
        document.getElementById("loginPassword")?.value;

    const message =
        document.getElementById("loginMessage");

    try {

        const response =
            await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Login failed"
            );

        }

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.role
        );

        if (data.role === "ADMIN") {

            window.location.href =
                "admin-dashboard.html";

        } else {

            window.location.href =
                "jobs.html";

        }

    }
    catch (error) {

        if (message) {

            message.innerText =
                error.message;

        }

    }
}


/* =====================================================
   REGISTER
===================================================== */

async function register() {

    const name =
        document.getElementById(
            "registerName"
        )?.value;

    const email =
        document.getElementById(
            "registerEmail"
        )?.value;

    const password =
        document.getElementById(
            "registerPassword"
        )?.value;

    const message =
        document.getElementById(
            "registerMessage"
        );

    try {

        const response =
            await fetch(
                "/api/auth/register",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        password: password,

                        role: "USER"

                    })

                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Registration failed"
            );

        }

        alert(
            "Registration successful!"
        );

        window.location.href =
            "login.html";

    }
    catch (error) {

        if (message) {

            message.innerText =
                error.message;

        }

    }
}


/* =====================================================
   LOAD JOBS
===================================================== */

async function loadJobs() {

    const container =
        document.getElementById(
            "jobsContainer"
        );

    if (!container) {
        return;
    }

    const role =
        localStorage.getItem("role");

    try {

        const response =
            await fetch(
                "/api/jobs"
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load jobs"
            );

        }

        const jobs =
            await response.json();

        container.innerHTML = "";

        if (!jobs || jobs.length === 0) {

            container.innerHTML =
                "<p>No jobs available.</p>";

            return;
        }

        jobs.forEach(job => {

            let deleteButton = "";

            if (role === "ADMIN") {

                deleteButton = `

                    <button
                        onclick="deleteJob(${job.id})">

                        Delete

                    </button>

                `;

            }

            container.innerHTML += `

                <div class="job-card">

                    <h3>
                        ${escapeHtml(
                            job.title
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            job.description
                        )}
                    </p>

                    <p>
                        <b>Company:</b>
                        ${escapeHtml(
                            job.company
                        )}
                    </p>

                    <p>
                        <b>Location:</b>
                        ${escapeHtml(
                            job.location
                        )}
                    </p>

                    <p>
                        <b>Salary:</b>
                        ₹${job.salary ?? "N/A"}
                    </p>

                    <button
                        onclick="applyJob(${job.id})">

                        Apply

                    </button>

                    ${deleteButton}

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "Load jobs error:",
            error
        );

        container.innerHTML =
            "<p>Failed to load jobs</p>";

    }
}


/* =====================================================
   DELETE JOB
===================================================== */

async function deleteJob(id) {

    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");

    if (!token) {

        alert(
            "Please login first"
        );

        window.location.href =
            "login.html";

        return;
    }

    if (role !== "ADMIN") {

        alert(
            "Only Admin can delete jobs"
        );

        return;
    }

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this job?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response =
            await fetch(
                `/api/jobs/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );

        if (response.ok) {

            alert(
                "Job deleted successfully"
            );

            await loadJobs();

        }
        else {

            const errorText =
                await response.text();

            console.error(
                errorText
            );

            alert(
                errorText ||
                "Failed to delete job"
            );

        }

    }
    catch (error) {

        console.error(
            "Delete job error:",
            error
        );

        alert(
            "Server error"
        );

    }
}


/* =====================================================
   SEARCH JOBS
===================================================== */

async function searchJobs() {

    const titleElement =
        document.getElementById(
            "searchTitle"
        );

    const locationElement =
        document.getElementById(
            "searchLocation"
        );

    const sortElement =
        document.getElementById(
            "sortOption"
        );

    if (
        !titleElement ||
        !locationElement ||
        !sortElement
    ) {

        return;

    }

    const title =
        titleElement.value.trim();

    const location =
        locationElement.value.trim();

    const sortValue =
        sortElement.value;

    let sortBy =
        "createdAt";

    let direction =
        "desc";

    if (sortValue === "salaryHigh") {

        sortBy =
            "salary";

        direction =
            "desc";

    }
    else if (
        sortValue === "salaryLow"
    ) {

        sortBy =
            "salary";

        direction =
            "asc";

    }

    let url =
        `/api/jobs/search?page=0&size=10&sortBy=${sortBy}&direction=${direction}`;

    if (title) {

        url +=
            `&title=${encodeURIComponent(
                title
            )}`;

    }

    if (location) {

        url +=
            `&location=${encodeURIComponent(
                location
            )}`;

    }

    try {

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Search failed"
            );

        }

        const data =
            await response.json();

        const jobs =
            data.content || data;

        const container =
            document.getElementById(
                "jobsContainer"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (
            !jobs ||
            jobs.length === 0
        ) {

            container.innerHTML =
                "<p>No jobs found</p>";

            return;

        }

        const role =
            localStorage.getItem(
                "role"
            );

        jobs.forEach(job => {

            let deleteButton = "";

            if (role === "ADMIN") {

                deleteButton = `

                    <button
                        onclick="deleteJob(${job.id})">

                        Delete

                    </button>

                `;

            }

            container.innerHTML += `

                <div class="job-card">

                    <h3>
                        ${escapeHtml(
                            job.title
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            job.description
                        )}
                    </p>

                    <p>
                        <b>Company:</b>
                        ${escapeHtml(
                            job.company
                        )}
                    </p>

                    <p>
                        <b>Location:</b>
                        ${escapeHtml(
                            job.location
                        )}
                    </p>

                    <p>
                        <b>Salary:</b>
                        ₹${job.salary ?? "N/A"}
                    </p>

                    <button
                        onclick="applyJob(${job.id})">

                        Apply

                    </button>

                    ${deleteButton}

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "Search error:",
            error
        );

    }
}


/* =====================================================
   APPLY JOB
===================================================== */

async function applyJob(jobId) {

    const token =
        localStorage.getItem(
            "token"
        );

    if (!token) {

        alert(
            "Please login first"
        );

        window.location.href =
            "login.html";

        return;
    }

    try {

        const response =
            await fetch(
                `/api/applications/apply/${jobId}`,
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );

        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text ||
                "Application failed"
            );

        }

        await response.json();

        alert(
            "Applied successfully!"
        );

    }
    catch (error) {

        alert(
            error.message
        );

    }
}


/* =====================================================
   LOAD MY APPLICATIONS
===================================================== */

async function loadMyApplications() {

    const container =
        document.getElementById(
            "applicationsContainer"
        );

    if (!container) {
        return;
    }

    const token =
        localStorage.getItem(
            "token"
        );

    if (!token) {

        window.location.href =
            "login.html";

        return;
    }

    container.innerHTML = `

        <div class="applications-loading">

            Loading your applications...

        </div>

    `;

    try {

        const response =
            await fetch(
                "/api/applications/my",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "role"
            );

            window.location.href =
                "login.html";

            return;

        }

        if (!response.ok) {

            throw new Error(
                "Failed to load applications"
            );

        }

        const applications =
            await response.json();

        container.innerHTML = "";


        /* =====================================================
        INTERVIEW NOTIFICATION
        ===================================================== */

        showInterviewNotification(
            applications
        );

        if (
            !applications ||
            applications.length === 0
        ) {

            container.innerHTML = `

                <div class="no-applications">

                    <h3>
                        No Applications Yet
                    </h3>

                    <p>
                        You have not applied for
                        any jobs yet.
                    </p>

                    <button
                        onclick="window.location.href='jobs.html'">

                        Browse Jobs

                    </button>

                </div>

            `;

            return;

        }

        applications.forEach(app => {

            const job =
                app.job || {};

            const status =
                app.status || "UNKNOWN";

            const statusClass =
                status.toLowerCase();

            container.innerHTML += `

                <div class="application-card">


                    <!-- =========================
                         APPLICATION HEADER
                    ========================== -->

                    <div class="application-header">

                        <div>

                            <h3>

                                ${escapeHtml(
                                    job.title ||
                                    "Job Title"
                                )}

                            </h3>

                            <p
                                class="application-company">

                                ${escapeHtml(
                                    job.company ||
                                    "Company"
                                )}

                            </p>

                        </div>


                        <!-- =====================
                             STATUS
                        ====================== -->

                        <span
                            class="status-badge status-${statusClass}">

                            ${formatApplicationStatus(
                                status
                            )}

                        </span>

                    </div>


                    <!-- =========================
                         APPLICATION INFORMATION
                    ========================== -->

                    <div class="application-info">


                        <!-- LOCATION -->

                        <div>

                            <span>
                                Location
                            </span>

                            <strong>

                                ${escapeHtml(
                                    job.location ||
                                    "N/A"
                                )}

                            </strong>

                        </div>


                        <!-- SALARY -->

                        <div>

                            <span>
                                Salary
                            </span>

                            <strong>

                                ₹${job.salary ??
                                "N/A"}

                            </strong>

                        </div>


                        <!-- APPLIED DATE -->

                        <div>

                            <span>
                                Applied Date
                            </span>

                            <strong>

                                ${
                                    app.appliedAt
                                    ? formatApplicationDate(
                                        app.appliedAt
                                    )
                                    : "N/A"
                                }

                            </strong>

                        </div>
 
 

${
    status === "INTERVIEW_SCHEDULED"
    ? `

        <div class="interview-details">

            <h4>
                Interview Details
            </h4>

            <div class="interview-info">

                <!-- INTERVIEW DATE -->

                <div>

                    <span>
                        Interview Date
                    </span>

                    <strong>

                        ${
                            app.interviewDate
                            ? formatInterviewDate(
                                app.interviewDate
                            )
                            : "N/A"
                        }

                    </strong>

                </div>


                <!-- INTERVIEW TIME -->

                <div>

                    <span>
                        Interview Time
                    </span>

                    <strong>

                        ${
                            app.interviewDate
                            ? formatInterviewTime(
                                app.interviewDate
                            )
                            : "N/A"
                        }

                    </strong>

                </div>


                <!-- REMARKS -->

                <div>

                    <span>
                        Remarks
                    </span>

                    <strong>

                        ${
                            escapeHtml(
                                app.remarks ||
                                     "No remarks"
                                            )
                                        }

                                    </strong>

                                </div>

                            </div>

                        </div>

                    `
                    : ""
                }   
                    </div>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "My Applications error:",
            error
        );

        container.innerHTML = `

            <div class="applications-error">

                <h3>
                    Failed to load applications
                </h3>

                <p>
                    Please try again.
                </p>

                <button
                    onclick="loadMyApplications()">

                    Try Again

                </button>

            </div>

        `;

    }
}


/* =====================================================
   FORMAT APPLICATION STATUS
===================================================== */

function formatApplicationStatus(
    status
) {

    if (!status) {
        return "Unknown";
    }

    return status
        .toLowerCase()
        .split("_")
        .map(word =>

            word.charAt(0).toUpperCase() +
            word.slice(1)

        )
        .join(" ");

}


/* =====================================================
   FORMAT APPLICATION DATE
===================================================== */

function formatApplicationDate(
    dateValue
) {

    try {

        return new Date(
            dateValue
        ).toLocaleDateString(
            "en-IN",
            {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }
        );

    }
    catch (error) {

        return dateValue;

    }
}
/* =====================================================
   FORMAT INTERVIEW DATE
===================================================== */

function formatInterviewDate(
    dateValue
) {

    try {

        return new Date(
            dateValue
        ).toLocaleDateString(
            "en-IN",
            {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }
        );

    }
    catch (error) {

        return dateValue;

    }
}


/* =====================================================
   FORMAT INTERVIEW TIME
===================================================== */

function formatInterviewTime(
    dateValue
) {

    try {

        return new Date(
            dateValue
        ).toLocaleTimeString(
            "en-IN",
            {

                hour: "2-digit",

                minute: "2-digit",

                hour12: true

            }
        );

    }
    catch (error) {

        return dateValue;

    }
}

/* =====================================================
   MY APPLICATIONS PAGE
===================================================== */

function goToMyApplications() {

    window.location.href =
        "my-applications.html";

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "role"
    );

    window.location.href =
        "login.html";

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =====================================================
   PAGE LOAD
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        loadJobs();

        loadMyApplications();

    }
);
/* =====================================================
   INTERVIEW NOTIFICATION
===================================================== */

function showInterviewNotification(
    applications
) {

    // Remove old notification if already exists

    const oldNotification =
        document.getElementById(
            "interviewNotification"
        );

    if (oldNotification) {

        oldNotification.remove();

    }


    if (
        !applications ||
        applications.length === 0
    ) {

        return;

    }


    // Find scheduled interviews

    const scheduledInterviews =
        applications.filter(
            app =>
                app.status ===
                "INTERVIEW_SCHEDULED"
        );


    if (
        scheduledInterviews.length === 0
    ) {

        return;

    }


    // Create notification

    const notification =
        document.createElement(
            "div"
        );


    notification.id =
        "interviewNotification";


    notification.style.cssText = `

        width: calc(100% - 40px);

        max-width: 1200px;

        margin: 25px auto 0 auto;

        padding: 20px 24px;

        background:
            linear-gradient(
                135deg,
                #172554,
                #312e81
            );

        border: 1px solid #38bdf8;

        border-radius: 14px;

        box-shadow:
            0 8px 25px
            rgba(0,0,0,0.25);

        color: white;

        box-sizing: border-box;

    `;


    let notificationHTML = `

        <div style="
            display:flex;
            align-items:center;
            gap:12px;
            margin-bottom:15px;
        ">

            <span style="
                font-size:25px;
            ">
                🔔
            </span>


            <h3 style="
                margin:0;
                color:#38bdf8;
                font-size:20px;
            ">

                Interview Scheduled

            </h3>

        </div>

    `;


    scheduledInterviews.forEach(
        app => {

            const job =
                app.job || {};


            const jobTitle =
                job.title ||
                "Job";


            const interviewDate =
                app.interviewDate;


            const date =
                interviewDate
                ? formatInterviewDate(
                    interviewDate
                )
                : "N/A";


            const time =
                interviewDate
                ? formatInterviewTime(
                    interviewDate
                )
                : "N/A";


            notificationHTML += `

                <div style="
                    padding:15px;
                    margin-top:10px;
                    background:
                        rgba(15,23,42,0.55);
                    border-radius:10px;
                ">

                    <strong style="
                        display:block;
                        font-size:17px;
                        margin-bottom:8px;
                    ">

                        ${escapeHtml(
                            jobTitle
                        )}

                    </strong>


                    <div style="
                        line-height:1.8;
                    ">

                        📅
                        <b>Date:</b>
                        ${date}

                        <br>

                        🕐
                        <b>Time:</b>
                        ${time}

                        <br>

                        💬
                        <b>Remarks:</b>
                        ${escapeHtml(
                            app.remarks ||
                            "No remarks"
                        )}

                    </div>

                </div>

            `;

        }
    );


    notification.innerHTML =
        notificationHTML;


    // Add notification before applications

    const wrapper =
        document.querySelector(
            ".applications-wrapper"
        );


    if (wrapper) {

        wrapper.parentNode.insertBefore(
            notification,
            wrapper
        );

    }

}