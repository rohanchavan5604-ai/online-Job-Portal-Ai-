// ============================================================
// ADMIN DASHBOARD
// ============================================================


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const token =
            localStorage.getItem("token");

        const role =
            localStorage.getItem("role");


        if (!token || role !== "ADMIN") {

            redirectToLogin();

            return;
        }


        createApplicationModal();


        await loadDashboard();

        await loadApplications();

        await loadUsers();

    }
);


// ============================================================
// REDIRECT TO LOGIN
// ============================================================

function redirectToLogin() {

    window.location.href =
        "login.html";

}


// ============================================================
// LOAD DASHBOARD STATISTICS
// ============================================================

async function loadDashboard() {

    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                "/api/admin/stats",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load dashboard"
            );

        }


        const data =
            await response.json();


        const totalJobs =
            document.getElementById(
                "totalJobs"
            );

        const totalUsers =
            document.getElementById(
                "totalUsers"
            );

        const totalApplications =
            document.getElementById(
                "totalApplications"
            );

        const totalApplied =
            document.getElementById(
                "totalApplied"
            );

        const totalShortlisted =
            document.getElementById(
                "totalShortlisted"
            );

        const totalInterviewScheduled =
            document.getElementById(
                "totalInterviewScheduled"
            );

        const totalInterviewed =
            document.getElementById(
                "totalInterviewed"
            );

        const totalOffered =
            document.getElementById(
                "totalOffered"
            );

        const totalHired =
            document.getElementById(
                "totalHired"
            );

        const totalRejected =
            document.getElementById(
                "totalRejected"
            );


        if (totalJobs) {

            totalJobs.textContent =
                data.totalJobs ?? 0;

        }


        if (totalUsers) {

            totalUsers.textContent =
                data.totalUsers ?? 0;

        }


        if (totalApplications) {

            totalApplications.textContent =
                data.totalApplications ?? 0;

        }


        if (totalApplied) {

            totalApplied.textContent =
                data.totalApplied ?? 0;

        }


        if (totalShortlisted) {

            totalShortlisted.textContent =
                data.totalShortlisted ?? 0;

        }


        if (totalInterviewScheduled) {

            totalInterviewScheduled.textContent =
                data.totalInterviewScheduled ?? 0;

        }


        if (totalInterviewed) {

            totalInterviewed.textContent =
                data.totalInterviewed ?? 0;

        }


        if (totalOffered) {

            totalOffered.textContent =
                data.totalOffered ?? 0;

        }


        if (totalHired) {

            totalHired.textContent =
                data.totalHired ?? 0;

        }


        if (totalRejected) {

            totalRejected.textContent =
                data.totalRejected ?? 0;

        }

    }
    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// ============================================================
// LOAD APPLICATIONS
// ============================================================

async function loadApplications() {

    const token =
        localStorage.getItem("token");


    const table =
        document.getElementById(
            "applicationsTable"
        );


    if (!table) {

        return;

    }


    try {

        const response =
            await fetch(
                "/api/admin/applications",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load applications"
            );

        }


        const applications =
            await response.json();


        table.innerHTML = "";


        if (
            !applications ||
            applications.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="no-action">

                        No applications available

                    </td>

                </tr>

            `;

            return;

        }


        applications.forEach(
            application => {

                const user =
                    application.user || {};


                const job =
                    application.job || {};


                const userName =
                    user.fullName || "N/A";


                const email =
                    user.email || "N/A";


                const jobTitle =
                    job.title || "N/A";


                const status =
                    application.status ||
                    "UNKNOWN";


                const statusClass =
                    status
                        .toLowerCase()
                        
                 .replace(/_/g, "-");


                const actionButtons =
                    getActionButtons(
                        application
                    );


                table.innerHTML += `

                    <tr>

                        <td>

                            ${escapeHtml(
                                userName
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                email
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                jobTitle
                            )}

                        </td>


                        <td>

                            <span
                                class="status ${statusClass}">

                                ${formatStatus(
                                    status
                                )}

                            </span>

                        </td>


                        <td>

                            <div
                                class="action-buttons">


                                <button
                                    class="btn-view"
                                    onclick="viewApplication(
                                        ${application.id}
                                    )">

                                    View

                                </button>


                                ${actionButtons}


                            </div>

                        </td>

                    </tr>

                `;

            }
        );

    }
    catch (error) {

        console.error(
            "Applications error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="color:#ef4444;">

                    Failed to load applications

                </td>

            </tr>

        `;

    }

}


// ============================================================
// APPLICATION STATUS ACTION BUTTONS
// ============================================================

function getActionButtons(
    application
) {

    const id =
        application.id;


    const status =
        application.status;


    let buttons = "";


    // ========================================================
    // APPLIED
    // ========================================================

    if (status === "APPLIED") {

        buttons += `

            <button
                class="btn-shortlist"
                onclick="updateApplicationStatus(
                    ${id},
                    'SHORTLISTED'
                )">

                Shortlist

            </button>


            <button
                class="btn-reject"
                onclick="updateApplicationStatus(
                    ${id},
                    'REJECTED'
                )">

                Reject

            </button>

        `;

    }


    // ========================================================
    // SHORTLISTED
    // ========================================================

    else if (
        status === "SHORTLISTED"
    ) {

        buttons += `

            <button
                class="btn-interview"
                onclick="scheduleInterview(
                    ${id}
                )">

                Interview

            </button>


            <button
                class="btn-reject"
                onclick="updateApplicationStatus(
                    ${id},
                    'REJECTED'
                )">

                Reject

            </button>

        `;

    }


    // ========================================================
    // INTERVIEW SCHEDULED
    // ========================================================

    else if (
        status === "INTERVIEW_SCHEDULED"
    ) {

        buttons += `

            <button
                class="btn-interview"
                onclick="updateApplicationStatus(
                    ${id},
                    'INTERVIEWED'
                )">

                Interviewed

            </button>


            <button
                class="btn-reject"
                onclick="updateApplicationStatus(
                    ${id},
                    'REJECTED'
                )">

                Reject

            </button>

        `;

    }


    // ========================================================
    // INTERVIEWED
    // ========================================================

    else if (
        status === "INTERVIEWED"
    ) {

        buttons += `

            <button
                class="btn-hire"
                onclick="updateApplicationStatus(
                    ${id},
                    'OFFERED'
                )">

                Offer

            </button>


            <button
                class="btn-reject"
                onclick="updateApplicationStatus(
                    ${id},
                    'REJECTED'
                )">

                Reject

            </button>

        `;

    }


    // ========================================================
    // OFFERED
    // ========================================================

    else if (
        status === "OFFERED"
    ) {

        buttons += `

            <button
                class="btn-hire"
                onclick="updateApplicationStatus(
                    ${id},
                    'HIRED'
                )">

                Hire

            </button>


            <button
                class="btn-reject"
                onclick="updateApplicationStatus(
                    ${id},
                    'REJECTED'
                )">

                Reject

            </button>

        `;

    }


    // ========================================================
    // HIRED / REJECTED
    // ========================================================

    else {

        buttons += `

            <span class="no-action">

                No action available

            </span>

        `;

    }


    return buttons;

}


// ============================================================
// UPDATE APPLICATION STATUS
// ============================================================

async function updateApplicationStatus(
    applicationId,
    status
) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        redirectToLogin();

        return;

    }


            const confirmAction = await showConfirmPopup(
            "Change Application Status?",
            "Are you sure you want to change the status to " +
            formatStatus(status) +
            "?"
        );

        if (!confirmAction) {
            return;
        }


    try {

        const response =
            await fetch(
                `/api/applications/${applicationId}/status`,
                {
                    method: "PUT",

                    headers: {

                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        status:
                            status

                    })

                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            throw new Error(
                responseText ||
                "Failed to update status"
            );

        }


        console.log(
            "Status update response:",
            responseText
        );


            showSuccessPopup(
            "Application status updated successfully."
        );


        await loadApplications();

        await loadDashboard();

    }
    catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            error.message ||
            "Failed to update application status"
        );

    }

}


// ============================================================
// SCHEDULE INTERVIEW
// ============================================================

async function scheduleInterview(
    applicationId
) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        redirectToLogin();

        return;

    }


    // ========================================================
    // REMOVE EXISTING INTERVIEW MODAL
    // ========================================================

    const oldModal =
        document.getElementById(
            "scheduleInterviewModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    // ========================================================
    // CREATE MODAL
    // ========================================================

    const modal =
        document.createElement("div");


    modal.id =
        "scheduleInterviewModal";


    modal.style.position =
        "fixed";


    modal.style.top =
        "0";


    modal.style.left =
        "0";


    modal.style.width =
        "100%";


    modal.style.height =
        "100%";


    modal.style.background =
        "rgba(0, 0, 0, 0.70)";


    modal.style.display =
        "flex";


    modal.style.justifyContent =
        "center";


    modal.style.alignItems =
        "center";


    modal.style.zIndex =
        "99999";


    modal.innerHTML = `

        <div style="
            width:470px;
            max-width:92%;
            background:#172033;
            color:white;
            padding:32px;
            border-radius:18px;
            box-shadow:0 20px 60px rgba(0,0,0,0.6);
            box-sizing:border-box;
        ">


            <h2 style="
                margin:0 0 28px 0;
                color:#38bdf8;
                font-size:27px;
            ">

                Schedule Interview

            </h2>


            <!-- =================================================
                 DATE
                 ================================================= -->

            <label style="
                display:block;
                margin-bottom:8px;
                font-weight:bold;
                font-size:16px;
            ">

                Interview Date

            </label>


            <input
                type="date"
                id="interviewDateInput"
                style="
                    width:100%;
                    height:46px;
                    padding:10px 12px;
                    margin-bottom:20px;
                    border:1px solid #475569;
                    border-radius:8px;
                    background:#0f172a;
                    color:white;
                    box-sizing:border-box;
                    font-size:15px;
                "
            >


            <!-- =================================================
                 TIME
                 ================================================= -->

            <label style="
                display:block;
                margin-bottom:8px;
                font-weight:bold;
                font-size:16px;
            ">

                Interview Time

            </label>


            <input
                type="time"
                id="interviewTimeInput"
                style="
                    width:100%;
                    height:46px;
                    padding:10px 12px;
                    margin-bottom:20px;
                    border:1px solid #475569;
                    border-radius:8px;
                    background:#0f172a;
                    color:white;
                    box-sizing:border-box;
                    font-size:15px;
                "
            >


            <!-- =================================================
                 REMARKS
                 ================================================= -->

            <label style="
                display:block;
                margin-bottom:8px;
                font-weight:bold;
                font-size:16px;
            ">

                Interview Remarks

            </label>


            <textarea
                id="interviewRemarksInput"
                placeholder="Example: Technical interview with HR"
                style="
                    width:100%;
                    height:100px;
                    padding:12px;
                    margin-bottom:25px;
                    border:1px solid #475569;
                    border-radius:8px;
                    background:#0f172a;
                    color:white;
                    resize:none;
                    box-sizing:border-box;
                    font-family:inherit;
                    font-size:14px;
                "
            ></textarea>


            <!-- =================================================
                 BUTTONS
                 ================================================= -->

            <div style="
                display:flex;
                justify-content:flex-end;
                gap:12px;
            ">


                <button
                    type="button"
                    id="cancelInterviewBtn"
                    style="
                        padding:12px 20px;
                        border:none;
                        border-radius:8px;
                        background:#475569;
                        color:white;
                        cursor:pointer;
                        font-size:14px;
                    "
                >

                    Cancel

                </button>


                <button
                    type="button"
                    id="scheduleInterviewBtn"
                    style="
                        padding:12px 20px;
                        border:none;
                        border-radius:8px;
                        background:#a855f7;
                        color:white;
                        font-weight:bold;
                        cursor:pointer;
                        font-size:14px;
                    "
                >

                    Schedule Interview

                </button>


            </div>


        </div>

    `;


    document.body.appendChild(
        modal
    );


    // ========================================================
    // GET INPUT ELEMENTS
    // ========================================================

    const dateInput =
        document.getElementById(
            "interviewDateInput"
        );


    const timeInput =
        document.getElementById(
            "interviewTimeInput"
        );


    const remarksInput =
        document.getElementById(
            "interviewRemarksInput"
        );


    const cancelButton =
        document.getElementById(
            "cancelInterviewBtn"
        );


    const scheduleButton =
        document.getElementById(
            "scheduleInterviewBtn"
        );


    // ========================================================
    // SET MINIMUM DATE
    // ========================================================

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    const todayString =
        `${year}-${month}-${day}`;


    dateInput.min =
        todayString;


    // ========================================================
    // CANCEL BUTTON
    // ========================================================

    cancelButton.onclick =
        function () {

            modal.remove();

        };


    // ========================================================
    // CLICK OUTSIDE MODAL
    // ========================================================

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );


    // ========================================================
    // SCHEDULE BUTTON
    // ========================================================

    scheduleButton.onclick =
        async function () {

            const date =
                dateInput.value;


            const time =
                timeInput.value;


            const remarks =
                remarksInput.value.trim();


            // --------------------------------------------------
            // DATE VALIDATION
            // --------------------------------------------------

            if (!date) {

                alert(
                    "Please select interview date."
                );

                return;

            }


            // --------------------------------------------------
            // TIME VALIDATION
            // --------------------------------------------------

            if (!time) {

                alert(
                    "Please select interview time."
                );

                return;

            }


            // --------------------------------------------------
            // CREATE LOCAL DATE TIME
            // --------------------------------------------------

            const interviewDate =
                date +
                "T" +
                time;


            // --------------------------------------------------
            // CHECK FUTURE DATE
            // --------------------------------------------------

            const selectedDate =
                new Date(
                    interviewDate
                );


            if (
                isNaN(
                    selectedDate.getTime()
                )
            ) {

                alert(
                    "Invalid interview date or time."
                );

                return;

            }


            if (
                selectedDate <= new Date()
            ) {

                alert(
                    "Interview date and time must be in the future."
                );

                return;

            }


            // --------------------------------------------------
            // DISABLE BUTTON
            // --------------------------------------------------

            scheduleButton.disabled =
                true;


            scheduleButton.textContent =
                "Scheduling...";


            try {

                // ==============================================
                // SEND REQUEST
                // ==============================================

                const response =
                    await fetch(
                        `/api/applications/${applicationId}/schedule-interview`,
                        {

                            method: "PUT",

                            headers: {

                                "Authorization":
                                    "Bearer " + token,

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    interviewDate:
                                        interviewDate,

                                    remarks:
                                        remarks

                                })

                        }
                    );


                // ==============================================
                // READ RESPONSE AS TEXT
                // ==============================================

                const responseText =
                    await response.text();


                console.log(
                    "Schedule interview HTTP status:",
                    response.status
                );


                console.log(
                    "Schedule interview response:",
                    responseText
                );


                // ==============================================
                // SERVER ERROR
                // ==============================================

                if (!response.ok) {

                    let errorMessage =
                        "Failed to schedule interview";


                    if (
                        responseText &&
                        responseText.trim()
                    ) {

                        try {

                            const errorData =
                                JSON.parse(
                                    responseText
                                );


                            errorMessage =
                                errorData.message ||
                                errorData.error ||
                                responseText;

                        }
                        catch (e) {

                            errorMessage =
                                responseText;

                        }

                    }


                    throw new Error(
                        errorMessage
                    );

                }


                // ==============================================
                // SUCCESS
                // ==============================================

               modal.remove();

                showSuccessPopup(
                    "Interview scheduled successfully."
                );

                await loadApplications();

                await loadDashboard();

            }
            catch (error) {

                console.error(
                    "Schedule interview error:",
                    error
                );


                scheduleButton.disabled =
                    false;


                scheduleButton.textContent =
                    "Schedule Interview";


                alert(
                    error.message ||
                    "Failed to schedule interview"
                );

            }

        };

}


// ============================================================
// VIEW APPLICATION
// ============================================================

async function viewApplication(
    applicationId
) {

    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                `/api/applications/${applicationId}`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load application"
            );

        }


        const application =
            await response.json();


        const user =
            application.user || {};


        const job =
            application.job || {};


        const modalUser =
            document.getElementById(
                "modalUser"
            );


        const modalEmail =
            document.getElementById(
                "modalEmail"
            );


        const modalJob =
            document.getElementById(
                "modalJob"
            );


        const modalCompany =
            document.getElementById(
                "modalCompany"
            );


        const modalLocation =
            document.getElementById(
                "modalLocation"
            );


        const modalSalary =
            document.getElementById(
                "modalSalary"
            );


        const modalStatus =
            document.getElementById(
                "modalStatus"
            );


        const modalAppliedAt =
            document.getElementById(
                "modalAppliedAt"
            );


        const applicationModal =
            document.getElementById(
                "applicationModal"
            );


        if (modalUser) {

            modalUser.textContent =
                user.fullName || "N/A";

        }


        if (modalEmail) {

            modalEmail.textContent =
                user.email || "N/A";

        }


        if (modalJob) {

            modalJob.textContent =
                job.title || "N/A";

        }


        if (modalCompany) {

            modalCompany.textContent =
                job.company || "N/A";

        }


        if (modalLocation) {

            modalLocation.textContent =
                job.location || "N/A";

        }


        if (modalSalary) {

            modalSalary.textContent =
                job.salary != null
                    ? "₹" + job.salary
                    : "N/A";

        }


        if (modalStatus) {

            modalStatus.textContent =
                formatStatus(
                    application.status
                );

        }


        if (modalAppliedAt) {

            modalAppliedAt.textContent =
                application.appliedAt
                    ? formatDate(
                        application.appliedAt
                    )
                    : "N/A";

        }


        if (applicationModal) {

            applicationModal.classList.add(
                "show"
            );

        }

    }
    catch (error) {

        console.error(
            "View application error:",
            error
        );


        alert(
            "Failed to load application details"
        );

    }

}


// ============================================================
// CREATE APPLICATION MODAL
// ============================================================

function createApplicationModal() {

    if (
        document.getElementById(
            "applicationModal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement("div");


    modal.id =
        "applicationModal";


    modal.className =
        "application-modal";


    modal.innerHTML = `

        <div class="modal-content">


            <button
                class="modal-close"
                onclick="closeApplicationModal()"
            >

                &times;

            </button>


            <h2>
                Application Details
            </h2>


            <div class="modal-details">


                <div class="detail-item">

                    <span>
                        User
                    </span>

                    <strong
                        id="modalUser"
                    >

                        -

                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Email
                    </span>

                    <strong
                        id="modalEmail"
                    >

                        -

                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Job
                    </span>

                    <strong
                        id="modalJob"
                    >

                        -

                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Company
                    </span>

                    <strong
                        id="modalCompany"
                    >

                        -

                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Location
                    </span>

                    <strong
                        id="modalLocation"
                    >

                        -

                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Salary
                    </span>

                    <strong
                        id="modalSalary"
                    >

                        -

                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Status
                    </span>

                    <strong
                        id="modalStatus"
                    >

                        -

                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Applied At
                    </span>

                    <strong
                        id="modalAppliedAt"
                    >

                        -

                    </strong>

                </div>


            </div>


        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeApplicationModal();

            }

        }
    );

}


// ============================================================
// CLOSE APPLICATION MODAL
// ============================================================

function closeApplicationModal() {

    const modal =
        document.getElementById(
            "applicationModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// ============================================================
// LOAD USERS
// ============================================================

async function loadUsers() {

    const token =
        localStorage.getItem("token");


    const table =
        document.getElementById(
            "usersTableBody"
        );


    if (!table) {

        return;

    }


    try {

        const response =
            await fetch(
                "/api/admin/users",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load users"
            );

        }


        const users =
            await response.json();


        table.innerHTML = "";


        if (
            !users ||
            users.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="no-action">

                        No users available

                    </td>

                </tr>

            `;

            return;

        }


        users.forEach(
            user => {

                table.innerHTML += `

                    <tr>

                        <td>

                            ${user.id ?? "N/A"}

                        </td>


                        <td>

                            ${escapeHtml(
                                user.fullName ||
                                "N/A"
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                user.email ||
                                "N/A"
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                user.role ||
                                "N/A"
                            )}

                        </td>

                    </tr>

                `;

            }
        );

    }
    catch (error) {

        console.error(
            "Users error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="color:#ef4444;">

                    Failed to load users

                </td>

            </tr>

        `;

    }

}


// ============================================================
// LOAD ADMIN JOBS
// ============================================================

async function loadAdminJobs() {

    const token =
        localStorage.getItem("token");


    const role =
        localStorage.getItem("role");


    if (
        !token ||
        role !== "ADMIN"
    ) {

        redirectToLogin();

        return;

    }


    const container =
        document.getElementById(
            "adminJobsContainer"
        );


    if (!container) {

        return;

    }


    try {

        const response =
            await fetch(
                "/api/jobs",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load jobs"
            );

        }


        const jobs =
            await response.json();


        container.innerHTML = "";


        if (
            !jobs ||
            jobs.length === 0
        ) {

            container.innerHTML =
                "<p class='no-action'>No jobs available.</p>";

            return;

        }


        jobs.forEach(
            job => {

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

                            <b>
                                Company:
                            </b>

                            ${escapeHtml(
                                job.company
                            )}

                        </p>


                        <p>

                            <b>
                                Location:
                            </b>

                            ${escapeHtml(
                                job.location
                            )}

                        </p>


                        <p>

                            <b>
                                Salary:
                            </b>

                            ₹${job.salary ?? "N/A"}

                        </p>


                        <button
                            class="btn-reject"
                            onclick="deleteJob(
                                ${job.id}
                            )"
                        >

                            Delete Job

                        </button>


                    </div>

                `;

            }
        );

    }
    catch (error) {

        console.error(
            "Jobs error:",
            error
        );


        container.innerHTML =
            "<p>Failed to load jobs</p>";

    }

}


// ============================================================
// DELETE JOB
// ============================================================

async function deleteJob(
    id
) {

    const token =
        localStorage.getItem("token");


    const role =
        localStorage.getItem("role");


    if (
        !token ||
        role !== "ADMIN"
    ) {

        alert(
            "Only admin can delete jobs"
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


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                "Failed to delete job"
            );

        }


        alert(
            "Job deleted successfully."
        );


        await loadAdminJobs();


        await loadDashboard();

    }
    catch (error) {

        console.error(
            "Delete job error:",
            error
        );


        alert(
            error.message ||
            "Server error while deleting job"
        );

    }

}


// ============================================================
// LOGOUT
// ============================================================

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


// ============================================================
// FORMAT STATUS
// ============================================================

function formatStatus(
    status
) {

    if (!status) {

        return "Unknown";

    }


    return status

        .toLowerCase()

        .split("_")

        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )

        .join(" ");

}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(
    dateValue
) {

    try {

        return new Date(
            dateValue
        ).toLocaleString();

    }
    catch (error) {

        return dateValue;

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(
    value
) {

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
// ============================================================
// SUCCESS POPUP
// ============================================================

function showSuccessPopup(message) {

    const popup =
        document.createElement("div");

    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0, 0, 0, 0.70)";
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.zIndex = "100000";

    popup.innerHTML = `

        <div style="
            width:420px;
            max-width:90%;
            background:#172033;
            color:white;
            padding:35px;
            border-radius:16px;
            text-align:center;
            box-shadow:0 15px 50px rgba(0,0,0,0.6);
        ">

            <div style="
                width:65px;
                height:65px;
                margin:0 auto 20px auto;
                border-radius:50%;
                background:#22c55e;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:35px;
                font-weight:bold;
            ">
                ✓
            </div>

            <h2 style="
                margin:0 0 12px 0;
                color:#38bdf8;
            ">
                Success
            </h2>

            <p style="
                margin:0 0 25px 0;
                color:#e2e8f0;
                font-size:16px;
            ">
                ${escapeHtml(message)}
            </p>

            <button
                id="successPopupOk"
                style="
                    padding:11px 30px;
                    border:none;
                    border-radius:8px;
                    background:#22c55e;
                    color:white;
                    font-size:15px;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                OK
            </button>

        </div>

    `;

    document.body.appendChild(popup);


    document.getElementById(
        "successPopupOk"
    ).onclick = function () {

        popup.remove();

    };


    popup.addEventListener(
        "click",
        function (event) {

            if (
                event.target === popup
            ) {

                popup.remove();

            }

        }
    );

}
// ============================================================
// CUSTOM CONFIRMATION POPUP
// ============================================================

function showConfirmPopup(title, message) {

    return new Promise((resolve) => {

        const popup = document.createElement("div");

        popup.style.position = "fixed";
        popup.style.top = "0";
        popup.style.left = "0";
        popup.style.width = "100%";
        popup.style.height = "100%";
        popup.style.background = "rgba(0, 0, 0, 0.70)";
        popup.style.display = "flex";
        popup.style.justifyContent = "center";
        popup.style.alignItems = "center";
        popup.style.zIndex = "100000";

        popup.innerHTML = `

            <div style="
                width:420px;
                max-width:90%;
                background:#172033;
                color:white;
                padding:35px;
                border-radius:18px;
                text-align:center;
                box-shadow:0 20px 60px rgba(0,0,0,0.6);
                border:1px solid #38bdf8;
            ">

                <div style="
                    width:65px;
                    height:65px;
                    margin:0 auto 20px auto;
                    border-radius:50%;
                    background:#a855f7;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:30px;
                ">
                    ?
                </div>

                <h2 style="
                    margin:0 0 12px 0;
                    color:#38bdf8;
                    font-size:24px;
                ">
                    ${escapeHtml(title)}
                </h2>

                <p style="
                    margin:0 0 28px 0;
                    color:#e2e8f0;
                    font-size:16px;
                ">
                    ${escapeHtml(message)}
                </p>

                <div style="
                    display:flex;
                    justify-content:center;
                    gap:15px;
                ">

                    <button
                        id="confirmCancelBtn"
                        style="
                            padding:12px 25px;
                            border:none;
                            border-radius:8px;
                            background:#475569;
                            color:white;
                            font-size:15px;
                            cursor:pointer;
                        "
                    >
                        Cancel
                    </button>

                    <button
                        id="confirmOkBtn"
                        style="
                            padding:12px 25px;
                            border:none;
                            border-radius:8px;
                            background:#22c55e;
                            color:white;
                            font-size:15px;
                            font-weight:bold;
                            cursor:pointer;
                        "
                    >
                        Confirm
                    </button>

                </div>

            </div>

        `;

        document.body.appendChild(popup);

 

        document.getElementById(
            "confirmOkBtn"
        ).onclick = function () {

            popup.remove();

            resolve(true);

        };

 

        document.getElementById(
            "confirmCancelBtn"
        ).onclick = function () {

            popup.remove();

            resolve(false);

        };
 

        popup.addEventListener(
            "click",
            function (event) {

                if (event.target === popup) {

                    popup.remove();

                    resolve(false);

                }

            }
        );

    });

}