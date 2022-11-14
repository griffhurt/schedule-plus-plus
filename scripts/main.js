window.setInterval(() => {
    try {
        const ifr = document.getElementById("main_iframe")
        const d = ifr.contentWindow.document;

        // Get the page name
        const pn = getPageName(d)

        // Checking if on the schedule page
        if (pn === "Schedule") {
            updateScheduleProfessors(d)
        // Checking if in the course catalogue
        } else if (pn.match(/([A-Z]+) (\d{4}) - (.+)/g)) {
            // Get the name of the subject
            const mat = pn.match(/([A-Z]+) (\d{4}) - (.+)/)
            const subjectName = mat[1].toUpperCase()
            const subjectNumber = parseInt(mat[2])
            updateCourseCatalogProfessors(d, subjectName, subjectNumber)
        } else if (pn === "Class Search") {
            updateCourseSearchProfessors(d)
        } else if (pn === "Shopping Cart") {
            updateShoppingCart(d)
        } else if (pn === "Edit Enrollment") {
            updateEditEnrollment(d)
        } else if (pn === "Drop Classes") {
            updateDropClasses(d)
        } else if (pn === "Select Sections") {
            updateSBSelectSections(d)
        } else if (pn === "Schedules" || pn === "Favorites") {
            updateSBSchedules(d)
        }
    } catch (e) {
        ;
    }
}, 500)