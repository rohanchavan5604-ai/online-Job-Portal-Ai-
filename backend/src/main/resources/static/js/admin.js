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

        await loadAdminJobs();

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


    const confirmAction =
        await showConfirmPopup(
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

                    body:
                        JSON.stringify({

                            status:
                                status

                        })

                }
            );


        const responseText =
            await response.text();


        console.log(
            "Status update response:",
            responseText
        );


        if (!response.ok) {

            throw new Error(
                responseText ||
                "Failed to update status"
            );

        }


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
    // CANCEL
    // ========================================================

    cancelButton.onclick =
        function () {

            modal.remove();

        };


    // ========================================================
    // CLICK OUTSIDE
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
    // SCHEDULE
    // ========================================================

    scheduleButton.onclick =
        async function () {

            const date =
                dateInput.value;


            const time =
                timeInput.value;


            const remarks =
                remarksInput.value.trim();


            if (!date) {

                alert(
                    "Please select interview date."
                );

                return;

            }


            if (!time) {

                alert(
                    "Please select interview time."
                );

                return;

            }


            const interviewDate =
                date +
                "T" +
                time;


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


            scheduleButton.disabled =
                true;


            scheduleButton.textContent =
                "Scheduling...";


            try {

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


    // IMPORTANT:
    // HTML मध्ये adminJobsTableBody आहे.
    // त्यामुळे table body हाच वापरला आहे.

    const table =
        document.getElementById(
            "adminJobsTableBody"
        );


    if (!table) {

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


        table.innerHTML = "";


        if (
            !jobs ||
            jobs.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="no-action">

                        No jobs available.

                    </td>

                </tr>

            `;

            return;

        }


        jobs.forEach(
            job => {

                table.innerHTML += `

                    <tr>

                        <td>

                            ${job.id ?? "N/A"}

                        </td>


                        <td>

                            ${escapeHtml(
                                job.title ||
                                "N/A"
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                job.company ||
                                "N/A"
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                job.location ||
                                "N/A"
                            )}

                        </td>


                        <td>

                            ${
                                job.salary != null
                                    ? "₹" + job.salary
                                    : "N/A"
                            }

                        </td>


                        <td>

                            <div
                                class="action-buttons">


                                <button
                                    type="button"
                                    class="btn-view"
                                    onclick="editJob(
                                        ${job.id}
                                    )">

                                    Edit

                                </button>


                                <button
                                    type="button"
                                    class="btn-reject"
                                    onclick="deleteJob(
                                        ${job.id}
                                    )">

                                    Delete

                                </button>


                            </div>

                        </td>

                    </tr>

                `;

            }
        );

    }
    catch (error) {

        console.error(
            "Jobs error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="color:#ef4444;">

                    Failed to load jobs

                </td>

            </tr>

        `;

    }

}


// ============================================================
// OPEN ADD JOB MODAL
// ============================================================

function openJobModal() {

    if (!checkAdmin()) {

        return;

    }


    const modal =
        document.getElementById(
            "jobModal"
        );


    const form =
        document.getElementById(
            "jobForm"
        );


    const title =
        document.getElementById(
            "jobModalTitle"
        );


    const jobId =
        document.getElementById(
            "jobId"
        );


    const jobTitle =
        document.getElementById(
            "jobTitle"
        );


    const jobDescription =
        document.getElementById(
            "jobDescription"
        );


    const jobCompany =
        document.getElementById(
            "jobCompany"
        );


    const jobLocation =
        document.getElementById(
            "jobLocation"
        );


    const jobSalary =
        document.getElementById(
            "jobSalary"
        );


    if (!modal) {

        alert(
            "Job modal not found in HTML"
        );

        return;

    }


    if (title) {

        title.textContent =
            "Add New Job";

    }


    if (form) {

        form.reset();

    }


    if (jobId) {

        jobId.value = "";

    }


    if (jobTitle) {

        jobTitle.value = "";

    }


    if (jobDescription) {

        jobDescription.value = "";

    }


    if (jobCompany) {

        jobCompany.value = "";

    }


    if (jobLocation) {

        jobLocation.value = "";

    }


    if (jobSalary) {

        jobSalary.value = "";

    }


    applyJobModalStyles();


    modal.classList.add(
        "show"
    );

}


// ============================================================
// CLOSE JOB MODAL
// ============================================================

function closeJobModal() {

    const modal =
        document.getElementById(
            "jobModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// ============================================================
// EDIT JOB
// ============================================================

async function editJob(
    id
) {

    if (!checkAdmin()) {

        return;

    }


    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                `/api/jobs/${id}`,
                {

                    method: "GET",

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
                "Failed to load job"
            );

        }


        const job =
            await response.json();


        const modal =
            document.getElementById(
                "jobModal"
            );


        const title =
            document.getElementById(
                "jobModalTitle"
            );


        const jobId =
            document.getElementById(
                "jobId"
            );


        const jobTitle =
            document.getElementById(
                "jobTitle"
            );


        const jobDescription =
            document.getElementById(
                "jobDescription"
            );


        const jobCompany =
            document.getElementById(
                "jobCompany"
            );


        const jobLocation =
            document.getElementById(
                "jobLocation"
            );


        const jobSalary =
            document.getElementById(
                "jobSalary"
            );


        if (!modal) {

            alert(
                "Job modal not found in HTML"
            );

            return;

        }


        if (title) {

            title.textContent =
                "Edit Job";

        }


        if (jobId) {

            jobId.value =
                job.id ?? "";

        }


        if (jobTitle) {

            jobTitle.value =
                job.title ?? "";

        }


        if (jobDescription) {

            jobDescription.value =
                job.description ?? "";

        }


        if (jobCompany) {

            jobCompany.value =
                job.company ?? "";

        }


        if (jobLocation) {

            jobLocation.value =
                job.location ?? "";

        }


        if (jobSalary) {

            jobSalary.value =
                job.salary ?? "";

        }


        applyJobModalStyles();


        modal.classList.add(
            "show"
        );

    }
    catch (error) {

        console.error(
            "Edit job error:",
            error
        );


        alert(
            error.message ||
            "Failed to load job"
        );

    }

}


// ============================================================
// SAVE JOB
// ADD + UPDATE
// ============================================================

async function saveJob(
    event
) {

    event.preventDefault();


    if (!checkAdmin()) {

        return;

    }


    const token =
        localStorage.getItem("token");


    const jobId =
        document.getElementById(
            "jobId"
        ).value.trim();


    const title =
        document.getElementById(
            "jobTitle"
        ).value.trim();


    const description =
        document.getElementById(
            "jobDescription"
        ).value.trim();


    const company =
        document.getElementById(
            "jobCompany"
        ).value.trim();


    const location =
        document.getElementById(
            "jobLocation"
        ).value.trim();


    const salaryValue =
        document.getElementById(
            "jobSalary"
        ).value.trim();


    if (!title) {

        alert(
            "Please enter job title."
        );

        return;

    }


    if (!description) {

        alert(
            "Please enter job description."
        );

        return;

    }


    if (!company) {

        alert(
            "Please enter company name."
        );

        return;

    }


    if (!location) {

        alert(
            "Please enter location."
        );

        return;

    }


    let salary = null;


    if (salaryValue !== "") {

        salary =
            Number(
                salaryValue
            );


        if (
            isNaN(salary) ||
            salary < 0
        ) {

            alert(
                "Please enter a valid salary."
            );

            return;

        }

    }


    const jobData = {

        title:
            title,

        description:
            description,

        company:
            company,

        location:
            location,

        salary:
            salary

    };


    const isEdit =
        jobId !== "";


    const url =
        isEdit
            ? `/api/jobs/${jobId}`
            : "/api/jobs";


    const method =
        isEdit
            ? "PUT"
            : "POST";


    const submitButton =
        document.querySelector(
            "#jobForm button[type='submit']"
        );


    if (submitButton) {

        submitButton.disabled =
            true;


        submitButton.textContent =
            isEdit
                ? "Updating..."
                : "Saving...";

    }


    try {

        const response =
            await fetch(
                url,
                {

                    method:
                        method,

                    headers: {

                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            jobData
                        )

                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            let errorMessage =
                isEdit
                    ? "Failed to update job"
                    : "Failed to create job";


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


        closeJobModal();


        showSuccessPopup(
            isEdit
                ? "Job updated successfully."
                : "Job created successfully."
        );


        await loadAdminJobs();

        await loadDashboard();

    }
    catch (error) {

        console.error(
            "Save job error:",
            error
        );


        alert(
            error.message ||
            "Server error while saving job"
        );

    }
    finally {

        if (submitButton) {

            submitButton.disabled =
                false;


            submitButton.textContent =
                "Save Job";

        }

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
        await showConfirmPopup(
            "Delete Job?",
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


        const responseText =
            await response.text();


        if (!response.ok) {

            let errorMessage =
                "Failed to delete job";


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


        showSuccessPopup(
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
// JOB MODAL STYLES
// FALLBACK STYLES
// ============================================================

function applyJobModalStyles() {

    const modal =
        document.getElementById(
            "jobModal"
        );


    if (!modal) {

        return;

    }


    modal.style.position =
        "fixed";


    modal.style.inset =
        "0";


    modal.style.display =
        "flex";


    modal.style.justifyContent =
        "center";


    modal.style.alignItems =
        "center";


    modal.style.padding =
        "20px";


    modal.style.background =
        "rgba(0, 0, 0, 0.70)";


    modal.style.backdropFilter =
        "blur(8px)";


    modal.style.zIndex =
        "5000";


    const content =
        modal.querySelector(
            ".job-modal-content"
        );


    if (!content) {

        return;

    }


    content.style.position =
        "relative";


    content.style.width =
        "100%";


    content.style.maxWidth =
        "560px";


    content.style.maxHeight =
        "90vh";


    content.style.overflowY =
        "auto";


    content.style.padding =
        "32px";


    content.style.background =
        "linear-gradient(145deg,#17213a,#111827)";


    content.style.border =
        "1px solid rgba(255,255,255,0.10)";


    content.style.borderRadius =
        "20px";


    content.style.boxShadow =
        "0 30px 80px rgba(0,0,0,0.50)";


    content.style.boxSizing =
        "border-box";


    const closeButton =
        modal.querySelector(
            ".job-modal-close"
        );


    if (closeButton) {

        closeButton.style.position =
            "absolute";


        closeButton.style.top =
            "15px";


        closeButton.style.right =
            "18px";


        closeButton.style.width =
            "38px";


        closeButton.style.height =
            "38px";


        closeButton.style.border =
            "none";


        closeButton.style.borderRadius =
            "50%";


        closeButton.style.background =
            "rgba(255,255,255,0.08)";


        closeButton.style.color =
            "white";


        closeButton.style.fontSize =
            "25px";


        closeButton.style.cursor =
            "pointer";

    }


    const modalTitle =
        document.getElementById(
            "jobModalTitle"
        );


    if (modalTitle) {

        modalTitle.style.marginBottom =
            "25px";


        modalTitle.style.fontSize =
            "28px";


        modalTitle.style.background =
            "linear-gradient(90deg,#38bdf8,#8b5cf6)";


        modalTitle.style.webkitBackgroundClip =
            "text";


        modalTitle.style.backgroundClip =
            "text";


        modalTitle.style.color =
            "transparent";

    }


    const groups =
        modal.querySelectorAll(
            ".job-form-group"
        );


    groups.forEach(
        group => {

            group.style.marginBottom =
                "18px";

        }
    );


    const labels =
        modal.querySelectorAll(
            ".job-form-group label"
        );


    labels.forEach(
        label => {

            label.style.display =
                "block";


            label.style.marginBottom =
                "8px";


            label.style.color =
                "#38bdf8";


            label.style.fontWeight =
                "600";


            label.style.fontSize =
                "14px";

        }
    );


    const inputs =
        modal.querySelectorAll(
            ".job-form-group input, .job-form-group textarea"
        );


    inputs.forEach(
        input => {

            input.style.width =
                "100%";


            input.style.padding =
                "12px 14px";


            input.style.border =
                "1px solid rgba(255,255,255,0.12)";


            input.style.borderRadius =
                "10px";


            input.style.background =
                "rgba(255,255,255,0.06)";


            input.style.color =
                "white";


            input.style.fontSize =
                "14px";


            input.style.boxSizing =
                "border-box";


            input.style.outline =
                "none";

        }
    );


    const textarea =
        modal.querySelector(
            "#jobDescription"
        );


    if (textarea) {

        textarea.style.resize =
            "vertical";


        textarea.style.minHeight =
            "120px";

    }


    const actions =
        modal.querySelector(
            ".job-form-actions"
        );


    if (actions) {

        actions.style.display =
            "flex";


        actions.style.justifyContent =
            "flex-end";


        actions.style.gap =
            "10px";


        actions.style.marginTop =
            "25px";

    }


    const saveButton =
        modal.querySelector(
            ".btn-save-job"
        );


    if (saveButton) {

        saveButton.style.padding =
            "12px 25px";


        saveButton.style.border =
            "none";


        saveButton.style.borderRadius =
            "9px";


        saveButton.style.background =
            "#22c55e";


        saveButton.style.color =
            "white";


        saveButton.style.fontWeight =
            "bold";


        saveButton.style.cursor =
            "pointer";

    }


    const cancelButton =
        modal.querySelector(
            ".btn-cancel-job"
        );


    if (cancelButton) {

        cancelButton.style.padding =
            "12px 25px";


        cancelButton.style.border =
            "none";


        cancelButton.style.borderRadius =
            "9px";


        cancelButton.style.background =
            "#475569";


        cancelButton.style.color =
            "white";


        cancelButton.style.fontWeight =
            "bold";


        cancelButton.style.cursor =
            "pointer";

    }

}


// ============================================================
// JOB MODAL FORM EVENT
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const jobForm =
            document.getElementById(
                "jobForm"
            );


        if (jobForm) {

            jobForm.addEventListener(
                "submit",
                saveJob
            );

        }


        const jobModal =
            document.getElementById(
                "jobModal"
            );


        if (jobModal) {

            jobModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        jobModal
                    ) {

                        closeJobModal();

                    }

                }
            );

        }

    }
);


// ============================================================
// CHECK ADMIN
// ============================================================

function checkAdmin() {

    const token =
        localStorage.getItem("token");


    const role =
        localStorage.getItem("role");


    if (
        !token ||
        role !== "ADMIN"
    ) {

        redirectToLogin();

        return false;

    }


    return true;

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

function showSuccessPopup(
    message
) {

    const popup =
        document.createElement("div");


    popup.style.position =
        "fixed";


    popup.style.top =
        "0";


    popup.style.left =
        "0";


    popup.style.width =
        "100%";


    popup.style.height =
        "100%";


    popup.style.background =
        "rgba(0, 0, 0, 0.70)";


    popup.style.display =
        "flex";


    popup.style.justifyContent =
        "center";


    popup.style.alignItems =
        "center";


    popup.style.zIndex =
        "100000";


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


    document.body.appendChild(
        popup
    );


    document.getElementById(
        "successPopupOk"
    ).onclick =
        function () {

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

function showConfirmPopup(
    title,
    message
) {

    return new Promise(
        (resolve) => {

            const popup =
                document.createElement(
                    "div"
                );


            popup.style.position =
                "fixed";


            popup.style.top =
                "0";


            popup.style.left =
                "0";


            popup.style.width =
                "100%";


            popup.style.height =
                "100%";


            popup.style.background =
                "rgba(0, 0, 0, 0.70)";


            popup.style.display =
                "flex";


            popup.style.justifyContent =
                "center";


            popup.style.alignItems =
                "center";


            popup.style.zIndex =
                "100000";


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


            document.body.appendChild(
                popup
            );


            document.getElementById(
                "confirmOkBtn"
            ).onclick =
                function () {

                    popup.remove();

                    resolve(true);

                };


            document.getElementById(
                "confirmCancelBtn"
            ).onclick =
                function () {

                    popup.remove();

                    resolve(false);

                };


            popup.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        popup
                    ) {

                        popup.remove();

                        resolve(false);

                    }

                }
            );

        }
    );

}