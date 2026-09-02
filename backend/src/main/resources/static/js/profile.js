document.addEventListener("DOMContentLoaded", async () => {

    const token =
        localStorage.getItem("token");


    // =====================================================
    // LOGIN CHECK
    // =====================================================

    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    // =====================================================
    // LOAD USER PROFILE
    // =====================================================

    try {

        const response =
            await fetch(
                "/api/users",
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
                "Failed to load profile"
            );

        }


        const users =
            await response.json();


        // =================================================
        // GET LOGGED-IN USER EMAIL FROM JWT
        // =================================================

        const payload =
            JSON.parse(
                atob(
                    token.split(".")[1]
                )
            );


        const email =
            payload.sub;


        // =================================================
        // FIND CURRENT USER
        // =================================================

        const currentUser =
            users.find(
                user =>
                    user.email === email
            );


        if (!currentUser) {

            throw new Error(
                "Current user not found"
            );

        }


        // =================================================
        // DISPLAY NAME
        // =================================================

        document.getElementById(
            "name"
        ).innerText =
            currentUser.fullName;


        // =================================================
        // DISPLAY EMAIL
        // =================================================

        document.getElementById(
            "email"
        ).innerText =
            currentUser.email;


        // =================================================
        // CHECK RESUME
        // =================================================

        if (
            currentUser.resumeFileName
        ) {

            document.getElementById(
                "resumeStatus"
            ).innerText =
                "Resume: " +
                currentUser.resumeFileName;


            document.getElementById(
                "resumeActions"
            ).style.display =
                "block";

        }
        else {

            document.getElementById(
                "resumeStatus"
            ).innerText =
                "No resume uploaded.";

        }

    }
    catch (error) {

        console.error(
            "Profile error:",
            error
        );

        const nameElement =
            document.getElementById(
                "name"
            );

        if (nameElement) {

            nameElement.innerText =
                "Unable to load profile";

        }

    }


    // =====================================================
    // UPLOAD RESUME
    // =====================================================

    document.getElementById(
        "uploadResumeBtn"
    ).addEventListener(
        "click",
        async () => {

            const fileInput =
                document.getElementById(
                    "resumeFile"
                );


            const file =
                fileInput.files[0];


            // -------------------------------------------------
            // FILE REQUIRED
            // -------------------------------------------------

            if (!file) {

                alert(
                    "Please select a PDF resume."
                );

                return;
            }


            // -------------------------------------------------
            // PDF CHECK
            // -------------------------------------------------

            if (
                file.type !==
                "application/pdf"
            ) {

                alert(
                    "Only PDF resume is allowed."
                );

                fileInput.value = "";

                return;
            }


            // -------------------------------------------------
            // FILE EXTENSION CHECK
            // -------------------------------------------------

            if (
                !file.name
                    .toLowerCase()
                    .endsWith(".pdf")
            ) {

                alert(
                    "Only PDF resume is allowed."
                );

                fileInput.value = "";

                return;
            }


            // -------------------------------------------------
            // FILE SIZE CHECK
            // -------------------------------------------------

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "Resume size must be less than 5 MB."
                );

                fileInput.value = "";

                return;
            }


            // -------------------------------------------------
            // FORM DATA
            // -------------------------------------------------

            const formData =
                new FormData();


            formData.append(
                "file",
                file
            );


            try {

                const response =
                    await fetch(
                        "/api/users/resume",
                        {
                            method: "POST",

                            headers: {
                                "Authorization":
                                    "Bearer " +
                                    token
                            },

                            body: formData
                        }
                    );


                const text =
                    await response.text();


                let data = {};

                try {

                    data =
                        JSON.parse(text);

                }
                catch (error) {

                    data = {
                        message: text
                    };

                }


                // -------------------------------------------------
                // ERROR
                // -------------------------------------------------

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to upload resume."
                    );

                    return;
                }


                // -------------------------------------------------
                // SUCCESS
                // -------------------------------------------------

                document.getElementById(
                    "resumeStatus"
                ).innerText =
                    "Resume: " +
                    (
                        data.fileName ||
                        file.name
                    );


                document.getElementById(
                    "resumeActions"
                ).style.display =
                    "block";


                fileInput.value =
                    "";


                alert(
                    "Resume uploaded successfully."
                );

            }
            catch (error) {

                console.error(
                    "Resume upload error:",
                    error
                );

                alert(
                    "Failed to upload resume."
                );

            }

        }
    );


    // =====================================================
    // VIEW RESUME
    // =====================================================

    document.getElementById(
        "viewResumeBtn"
    ).addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(
                        "/api/users/resume",
                        {
                            method: "GET",

                            headers: {
                                "Authorization":
                                    "Bearer " +
                                    token
                            }
                        }
                    );


                if (!response.ok) {

                    alert(
                        "Resume not found."
                    );

                    return;
                }


                const blob =
                    await response.blob();


                const url =
                    window.URL.createObjectURL(
                        blob
                    );


                window.open(
                    url,
                    "_blank"
                );


            }
            catch (error) {

                console.error(
                    "View resume error:",
                    error
                );

                alert(
                    "Failed to open resume."
                );

            }

        }
    );


    // =====================================================
    // DOWNLOAD RESUME
    // =====================================================

    document.getElementById(
        "downloadResumeBtn"
    ).addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(
                        "/api/users/resume",
                        {
                            method: "GET",

                            headers: {
                                "Authorization":
                                    "Bearer " +
                                    token
                            }
                        }
                    );


                if (!response.ok) {

                    alert(
                        "Resume not found."
                    );

                    return;
                }


                const blob =
                    await response.blob();


                const url =
                    window.URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    url;


                link.download =
                    "resume.pdf";


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                window.URL.revokeObjectURL(
                    url
                );


            }
            catch (error) {

                console.error(
                    "Download resume error:",
                    error
                );

                alert(
                    "Failed to download resume."
                );

            }

        }
    );


    // =====================================================
    // DELETE RESUME
    // =====================================================

    document.getElementById(
        "deleteResumeBtn"
    ).addEventListener(
        "click",
        async () => {


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete your resume?"
                );


            if (!confirmDelete) {

                return;

            }


            try {

                const response =
                    await fetch(
                        "/api/users/resume",
                        {
                            method: "DELETE",

                            headers: {
                                "Authorization":
                                    "Bearer " +
                                    token
                            }
                        }
                    );


                const text =
                    await response.text();


                let data = {};

                try {

                    data =
                        JSON.parse(text);

                }
                catch (error) {

                    data = {
                        message: text
                    };

                }


                // -------------------------------------------------
                // ERROR
                // -------------------------------------------------

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to delete resume."
                    );

                    return;
                }


                // -------------------------------------------------
                // SUCCESS
                // -------------------------------------------------

                document.getElementById(
                    "resumeStatus"
                ).innerText =
                    "No resume uploaded.";


                document.getElementById(
                    "resumeActions"
                ).style.display =
                    "none";


                document.getElementById(
                    "resumeFile"
                ).value =
                    "";


                alert(
                    "Resume deleted successfully."
                );


            }
            catch (error) {

                console.error(
                    "Delete resume error:",
                    error
                );

                alert(
                    "Failed to delete resume."
                );

            }

        }
    );

});