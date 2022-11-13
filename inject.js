window.setInterval(() => {
    try {
        const ifr = document.getElementById("main_iframe")
        const d = ifr.contentWindow.document;
        // Checking if on the schedule page
        if (getPageName(d) === "Schedule") {
            updateScheduleProfessors(d)
        // Checking if in the course catalogue
        } else if (getPageName(d).match(/([A-Z]+) (\d{4}) - (.+)/g)) {
            // Get the name of the subject
            const mat = getPageName(d).match(/([A-Z]+) (\d{4}) - (.+)/)
            const subjectName = mat[1].toUpperCase()
            const subjectNumber = parseInt(mat[2])
            updateCourseCatalogProfessors(d, subjectName, subjectNumber)
        } else if (getPageName(d) === "Class Search") {
            updateCourseSearchProfessors(d)
        } else if (getPageName(d) === "Shopping Cart") {
            updateShoppingCart(d)
        } else if (getPageName(d) === "Edit Enrollment") {
            updateEditEnrollment(d)
        } else if (getPageName(d) === "Drop Classes") {
            updateDropClasses(d)
        } else if (getPageName(d) === "Select Sections") {
            updateSBSelectSections(d)
        }
    } catch (e) {
        ;
    }
}, 500)

// API function

/**
 * Retrieves information about the professor and course from RMP
 * CURRENTLY A STAND-IN
 * @param {String} firstName The professor's first name
 * @param {String} lastName The professor's last name
 * @param {String} courseName The course's name (ex. CS or MUSIC)
 * @param {Number} courseNum The course's number (ex. 441 or 1443)
 * @returns {Object} Information about the overall and course ratings
 */
function getProfessorData(firstName, lastName, courseName, courseNum) {
    console.log("REQUEST: ", firstName, lastName, courseName, courseNum)
    return {
        id: Math.floor(Math.random() * 10000),
        overall: {
            difficulty: Math.random() * 5,
            quality: Math.random() * 5
        },
        course: {
            data: true,
            difficulty: Math.random() * 5,
            quality: Math.random() * 5
        }
    }
}

// HTML Traversal Helper Functions

/**
 * Returns the nth parent element of a node.
 * @param {Node} elem The element being explored
 * @param {Number} n The number of parents to go up
 * @returns {Node} The nth parent node of the element
 */
function nthParent(elem, n) {
    for (let i = 0; i < n; i++) {
        elem = elem.parentNode;
    }
    return elem;
}

/**
 * Returns a child of the element based on the indices given in childrenList.
 * @param {Node} elem The element being traversed
 * @param {Number[]} childrenList List of indices of children to traverse
 * @returns {Node} The child element
 */
function traverseChildren(elem, childrenList) {
    for (let i = 0; i < childrenList.length; i++) {
        elem = elem.children[childrenList[i]]
    }
    return elem;
}

// HTML Element Creation 

/**
 * Creates an HTML element with the stars and text stating how many stars
 * @param {Document} doc The document of the page
 * @param {Number} stars The number of stars to show in the element
 * @returns {Node} The crafted stars element
 */
function createStarElement(doc, stars) {
    const mainDiv = doc.createElement("div");
    // Configure flex
    mainDiv.style.display = "flex";
    mainDiv.style.alignItems = "center";
    // For the number of whole number stars
    for (let i = 0; i < Math.floor(stars); i++) {
        const s = doc.createElement("div")
        s.innerText = "★";
        if(stars > 2.5) {
            s.style.color = "#003594";
        }
        else {
            s.style.color = "#e01a04";
        }
        mainDiv.appendChild(s);
    }
    // Add the partial star
    const percent = Math.round((stars - Math.floor(stars)) * 100);
    if (percent > 0) {
        const partialStar = doc.createElement("div")
        if(stars > 2.5) {
            partialStar.style.cssText = `background: linear-gradient(to right, rgba(0,53,148,1) ${percent}%, rgba(0,53,148,0) ${percent}%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
        }
        else {
            partialStar.style.cssText = `background: linear-gradient(to right, rgba(224,26,4,1) ${percent}%, rgba(224,26,4,0) ${percent}%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
        }
        partialStar.innerText = "★";
        mainDiv.appendChild(partialStar)
    }

    // Add the number
    const num = doc.createElement("div")
    num.innerText = `(${stars.toFixed(2)})`
    num.style.fontFamily = "sans-serif"
    num.style.fontSize = "0.8rem"
    mainDiv.appendChild(num)
    mainDiv.classList.add("spp-stars")
    return mainDiv
}

/**
 * Creates a more detailed stars element for a professor
 * @param {Document} doc The document of the page
 * @param {Number} profId The RMP ID of the professor
 * @param {Number} overallQuality The overall quality rating of the professor
 * @param {Number} overallDifficulty The overall difficulty rating of the professor
 * @param {Number} [classQuality] The professor's quality for this class
 * @param {Number} [classDifficulty] The professor's difficulty for this class
 * @returns {Node} The detailed star element
 */
function createDetailedStarElement(
    doc,
    profId,
    overallQuality,
    overallDifficulty, 
    classQuality = null,
    classDifficulty = null
) {
    const mainDiv = doc.createElement("div")
    mainDiv.style.fontFamily = "sans-serif"

    if (classQuality !== null) {
        const classDiv = doc.createElement("div")
        // Create the label for the course specific data
        const classLabel = doc.createElement("div")
        classLabel.innerText = "Course:"
        classLabel.style.fontSize = "0.9rem"
        classDiv.appendChild(classLabel)

        // Inner div with flex
        const classInnerDiv = doc.createElement("div")
        classInnerDiv.style.display = "flex"

        const classQualityDiv = doc.createElement("div")
        // Quality label for class
        const classQualityLabel = doc.createElement("div")
        classQualityLabel.innerText = "Quality:"
        classQualityLabel.style.fontSize = "0.8rem"
        classQualityDiv.appendChild(classQualityLabel)
        // Quality stars for class
        const classQualityElem = createStarElement(doc, classQuality)
        classQualityDiv.appendChild(classQualityElem)
        classInnerDiv.appendChild(classQualityDiv)

        const classDifficultyDiv = doc.createElement("div")
        // Difficulty label for class
        const classDifficultyLabel = doc.createElement("div")
        classDifficultyLabel.innerText = "Difficulty:"
        classDifficultyLabel.style.fontSize = "0.8rem"
        classDifficultyDiv.appendChild(classDifficultyLabel)
        // Difficulty stars for class
        const classDifficultyElem = createStarElement(doc, classDifficulty)
        classDifficultyDiv.appendChild(classDifficultyElem)
        // Add a left margin
        classDifficultyDiv.style.marginLeft = "10px"
        // Add it to the main div
        classInnerDiv.append(classDifficultyDiv)

        classDiv.appendChild(classInnerDiv)
        mainDiv.appendChild(classDiv)
    }

    const overallDiv = doc.createElement("div")
    // Check if we need to add an overall label
    if (classQuality !== null) {
        const overallLabel = doc.createElement("div")
        overallLabel.innerText = "Overall:"
        overallLabel.style.fontSize = "0.9rem"
        overallDiv.appendChild(overallLabel)
    }
    const overallInnerDiv = doc.createElement("div")
    overallInnerDiv.style.display = "flex"

    const overallQualityDiv = doc.createElement("div")
    // Quality label for overall
    const overallQualityLabel = doc.createElement("div")
    overallQualityLabel.innerText = "Quality:"
    overallQualityLabel.style.fontSize = "0.8rem"
    overallQualityDiv.appendChild(overallQualityLabel)
    // Quality stars for overall
    const overallQualityElem = createStarElement(doc, overallQuality)
    overallQualityDiv.appendChild(overallQualityElem)
    overallInnerDiv.appendChild(overallQualityDiv)
    
    const overallDifficultyDiv = doc.createElement("div")
    // Difficulty label for overall
    const overallDifficultyLabel = doc.createElement("div")
    overallDifficultyLabel.innerText = "Difficulty:"
    overallDifficultyLabel.style.fontSize = "0.8rem"
    overallDifficultyDiv.appendChild(overallDifficultyLabel)
    // Difficulty stars for overall
    const overallDifficultyElem = createStarElement(doc, overallDifficulty)
    overallDifficultyDiv.appendChild(overallDifficultyElem)
    // Add overall to main div
    overallDifficultyDiv.style.marginLeft = "10px"
    overallInnerDiv.appendChild(overallDifficultyDiv)
    overallDiv.appendChild(overallInnerDiv)
    mainDiv.appendChild(overallDiv)

    const mainLink = doc.createElement("a")
    mainLink.style.all = "unset"
    mainLink.href = `https://www.ratemyprofessors.com/professor?tid=${profId}`
    mainLink.target = "_top"
    mainLink.style.cursor = "pointer"
    mainLink.classList.add("spp-stars")
    mainLink.appendChild(mainDiv)

    return mainLink
}

// API Functions

function getProfessorStars(profName, className) {
    return 4.6
}

// String helper functions

/**
 * Parses the name of a course
 * @param {String} courseName 
 * @returns {Array} The course name followed by the course number
 */
function parseCourseName(courseName) {
    const m = courseName.match(/([A-Z]+) (\d{4})/)
    if (m) {
        return [m[1].toUpperCase(), parseInt(m[2])]
    }
}

/**
 * Returns 
 * @param {String} profName 
 * @returns {String[] | null} The first name of the professor followed by the last name
 */
function parseProfessorName(profName) {
    // Strip off newlines if necessary
    if (profName.includes("\n")) {
        profName = profName.split("\n")[0]
    }
    // Strip off commas if necessary
    if (profName.includes(",")) {
        profName = profName.split(",")[0]
    }
    // Check for "To be Announced" and "Staff"
    if (profName.toLowerCase() == "to be announced" || profName.toLowerCase() == "staff") {
        return null
    }
    const m = profName.split(" ")
    for (let elem of m) {
        // Ensure all elements are words
        if (!elem.match(/[A-Za-z]+/)) {
            return null
        }
    }
    return [m[0].toLowerCase(), m[m.length - 1].toLowerCase()]
}

// Page Specific Functions
/**
 * Returns the name of the page in peoplesoft
 * @param {Document} doc 
 * @returns {(String | null)}
 */
function getPageName(doc) {
    try {
        return /[Cc]urrent [Pp]age\n(.+)\n/g.exec(doc.body.innerText)[1]
    } catch (e) {
        return null
    }
}

/**
 * Updates the professors with stars on the schedule page
 * @param {Document} doc The document of the page
 */
function updateScheduleProfessors(doc) {
    doc.querySelectorAll('[id$="-summary"]').forEach(elem => {
        const courseElem = traverseChildren(elem, [0, 0, 0, 0])
        const profElem = traverseChildren(elem, [0, 0, 0, 2, 0, 0, 0])

        const courseName = traverseChildren(courseElem, [0, 0, 0]).innerText;
        const courseNameParsed = parseCourseName(courseName)
        const profName = profElem.innerText;
        const profNameParsed = parseProfessorName(profName)
        
        // Die out if we can't get the prof's name or the course name
        if (!profNameParsed || !courseNameParsed) {
            return
        }

        // Holder for professor data
        let profData = null;

        if (profElem.getElementsByClassName("spp-stars").length < 1) {
            profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            const stars = createStarElement(doc, profData.overall.quality);
            profElem.appendChild(stars)
        }

        // Get expanded box
        const expanded = nthParent(elem, 3).getElementsByClassName("cx-MuiGrid-root css-f5ek5k p-3 m-0 position-relative h-100 w-100  cx-MuiGrid-container cx-MuiGrid-align-content-xs-flex-start")
        Array.from(expanded).forEach(elem => {
            if (traverseChildren(elem, [0]).innerText.toLowerCase() == "details") {
                const profElem2 = traverseChildren(elem, [2])
                if (profElem2.getElementsByClassName("spp-stars").length < 1) {
                    // Holder variable for stars2
                    let stars2 = null;
                    // Check if we have the prof data yet
                    if (!profData) {
                        profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
                    }
                    // Check to see if we have course data or not
                    if (!profData.course.data) {
                        stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty);
                    } else {
                        stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty, profData.course.quality, profData.course.difficulty)
                    }
                    profElem2.appendChild(stars2)
                }
            }
        })
    })
}

/**
 * Updates professors with stars on pages in the course catalog
 * @param {Document} doc The document of the page
 */
function updateCourseCatalogProfessors(doc, courseName, courseNum) {
    doc.querySelectorAll('[id$="-summary"]').forEach(elem => {
        const professorElem = traverseChildren(elem, [0, 6, 0, 0 ]);
        const profName = professorElem.innerText;
        const profNameParsed = parseProfessorName(profName)
        
        // Ensure we can parse the prof's name
        if (!profNameParsed) {
            return
        }

        // Holder for prof data
        let profData = null;

        if (professorElem.getElementsByClassName("spp-stars").length < 1) {
            profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseName, courseNum)
            const starElem = createStarElement(doc, profData.overall.quality);
            professorElem.appendChild(starElem);
        }

        const infoBlocks = nthParent(professorElem, 7).getElementsByTagName("dl");
        Array.from(infoBlocks).forEach(elem2 => {
            if (elem2.innerText.includes("Instructor:")) {
                const profDetailed = traverseChildren(elem2, [0, 0, 1])
                if (profDetailed.getElementsByClassName("spp-stars").length < 1) {
                    if (!profData) {
                        profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseName, courseNum)
                    }
                    // Holder variable for stars2
                    let stars2 = null;
                    if (profData.course.data) {
                        stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty, profData.course.quality, profData.course.difficulty);
                    } else {
                        stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty);
                    }
                    profDetailed.appendChild(stars2)
                }
            }
        })
    })
}

function updateCourseSearchProfessors(doc) {
    // Get the name of the 
    const h2Elem = doc.getElementsByTagName("h2")[0]
    const h2SpanElem = h2Elem.getElementsByTagName("span")[0]
    const courseNameParsed = parseCourseName(h2SpanElem.innerText.slice(3))

    // Die out if course name not parsed correctly
    if (!courseNameParsed) {
        return
    }

    doc.querySelectorAll('[id$="-summary"]').forEach(elem => {
        const professorElem = traverseChildren(elem, [0, 1, 0, 3, 0, 0, 0, 4]);

        const profName = professorElem.innerText
        const profNameParsed = parseProfessorName(profName)

        // Die out if professor name not parsed
        if (!profNameParsed) {
            return
        }
        
        // Holder variable for professor data
        let profData = null;

        if (professorElem.getElementsByClassName("spp-stars").length < 1) {
            profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])

            const starElem = createStarElement(doc, profData.overall.quality);
            const externalDiv = doc.createElement("div")
            // Replace the child with the external div
            professorElem.parentElement.replaceChild(externalDiv, professorElem)
            professorElem.className = "";
            professorElem.removeAttribute('style');
            externalDiv.appendChild(professorElem)
            externalDiv.appendChild(starElem)
        }

        const overallElem = nthParent(elem, 3)
        let instructorLabelElem = null;

        for (let elem2 of overallElem.getElementsByTagName("p")) {
            if (elem2.innerText.includes("Instructor:")) {
                instructorLabelElem = elem2
                break
            }
        }
        if (instructorLabelElem) {
            
            const detailsBlock = nthParent(instructorLabelElem, 2)
            const profDetailsElem = traverseChildren(detailsBlock, [2])
            if (profDetailsElem.getElementsByClassName("spp-stars").length < 1) {
                if (!profData) {
                    profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])   
                }

                // Create the stars
                let stars2 = null;
                if (profData.course.data) {
                    stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty, profData.course.quality, profData.course.difficulty);
                } else {
                    stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty);
                }
                profDetailsElem.appendChild(stars2)
            }
        }
    })
}

function updateShoppingCart(doc) {
    doc.querySelectorAll('[id$="-summary"]').forEach(elem => {
        const professorElem = traverseChildren(elem, [0, 3, 0, 3])
        
        const profName = professorElem.innerText
        const profNameParsed = parseProfessorName(profName)

        const courseElem = traverseChildren(elem, [0, 1, 0, 0, 0])
        const courseName = courseElem.innerText
        const courseNameParsed = parseCourseName(courseName)

        // Holder variable for professor data
        let profData = null;

        if (professorElem.getElementsByClassName("spp-stars").length < 1) {
            profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            const starElem = createStarElement(doc, profData.overall.quality);
            professorElem.appendChild(starElem)
        }

        const overallElem = nthParent(elem, 3)
        let detailsLabelElem = null
        for (let elem2 of overallElem.getElementsByTagName("h2")) {
            if (elem2.innerText.includes("DETAILS")) {
                detailsLabelElem = elem2
                break
            }
        }
        if (detailsLabelElem) {
            const detailsBlockElem = nthParent(detailsLabelElem, 2)
            const detailedInstructorElem = traverseChildren(detailsBlockElem, [2])
            if (detailedInstructorElem.getElementsByClassName("spp-stars").length < 1) {
                if (!profData) {
                    profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
                }
                // Create the stars
                let stars2 = null;
                if (profData.course.data) {
                    stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty, profData.course.quality, profData.course.difficulty);
                } else {
                    stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty);
                }
                detailedInstructorElem.appendChild(stars2)
            }
        }

    })
}

function updateEditEnrollment(doc) {
    const hrElem = doc.getElementsByTagName("hr")[0]
    const overallElem = nthParent(hrElem, 2)

    Array.from(overallElem.childNodes).slice(2).forEach(elem => {
        const rowElem = traverseChildren(elem, [0, 0, 0])

        const profElem = traverseChildren(rowElem, [2, 0, 3])
        const profName = profElem.innerText
        const profNameParsed = parseProfessorName(profName)

        const courseElem = traverseChildren(rowElem, [0, 0])
        const courseName = courseElem.innerText
        const courseNameParsed = parseCourseName(courseName)

        if (profElem.getElementsByClassName("spp-stars").length < 1) {
            const profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            
            const starElem = createStarElement(doc, profData.overall.quality);
            const externalDiv = doc.createElement("div")
            
            // Replace the child with the external div
            profElem.parentElement.replaceChild(externalDiv, profElem)
            profElem.className = "";
            profElem.removeAttribute('style');
            externalDiv.appendChild(profElem)
            externalDiv.appendChild(starElem)
        }
    })
}

function updateDropClasses(doc) {
    doc.querySelectorAll('[id$="-summary"]').forEach(elem => {
        const profElem = traverseChildren(elem, [0, 2, 0, 4])
        const profName = profElem.innerText
        const profNameParsed = parseProfessorName(profName)

        const courseElem = traverseChildren(elem, [0, 0])
        const courseName = courseElem.innerText
        const courseNameParsed = parseCourseName(courseName)

        if (!profNameParsed | !courseNameParsed) {
            return
        }

        let profData = null;

        if (profElem.getElementsByClassName("spp-stars").length < 1) {
            profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            
            const starElem = createStarElement(doc, profData.overall.quality);
            const externalDiv = doc.createElement("div")
            
            // Replace the child with the external div
            profElem.parentElement.replaceChild(externalDiv, profElem)
            profElem.className = "";
            profElem.removeAttribute('style');
            externalDiv.appendChild(profElem)
            externalDiv.appendChild(starElem)
        }

        const overallElem = nthParent(elem, 3)
        let detailsLabelElem = null;
        for (let elem2 of overallElem.getElementsByTagName("h3")) {
            if (elem2.innerText.includes("DETAILS")) {
                detailsLabelElem = elem2
                break
            }
        }

        if (detailsLabelElem) {
            const detailsElem = nthParent(detailsLabelElem, 2)
            const detailedInstructorElem = traverseChildren(detailsElem, [2])
            if (detailedInstructorElem.getElementsByClassName("spp-stars").length < 1) {
                if (!profData) {
                    profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
                }
                // Create the stars
                let stars2 = null;
                if (profData.course.data) {
                    stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty, profData.course.quality, profData.course.difficulty);
                } else {
                    stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty);
                }
                detailedInstructorElem.appendChild(stars2)
            }
        }
    })
}

function updateSBSelectSections(doc) {
    // Get the header
    const headerElem = doc.getElementsByTagName("h2")[0]
    const courseName = headerElem.innerText.split(" -")[0]
    const courseNameParsed = parseCourseName(courseName)

    // Find the horizontal break on the page
    const hrElem = doc.getElementsByTagName("hr")[0]
    const sectionsListElem = nthParent(hrElem, 4)
    // Get the courses
    const coursesElem = traverseChildren(sectionsListElem, [1, 0])

    Array.from(coursesElem.childNodes).forEach(elem => {
        const profElem = traverseChildren(elem, [0, 0, 0, 0, 5, 0, 0])
        const profName = profElem.innerText
        const profNameParsed = parseProfessorName(profName)
        
        // Holder variable for professor data
        let profData = null;
        
        if (profElem.getElementsByClassName("spp-stars").length < 1) {
            profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])

            const starElem = createStarElement(doc, profData.overall.quality);
            const externalDiv = doc.createElement("div")
            // Replace the child with the external div
            profElem.parentElement.replaceChild(externalDiv, profElem)
            profElem.className = "";
            profElem.removeAttribute('style');
            externalDiv.className = "cx-MuiGrid-root px-1 css-t8n52r cx-MuiGrid-item cx-MuiGrid-zeroMinWidth cx-MuiGrid-grid-xs-4"
            externalDiv.appendChild(profElem)
            externalDiv.appendChild(starElem)
        }

        const courseCollapseElem = traverseChildren(elem, [0, 1, 0, 0, 0])
        // Checking to see if the collapse is down
        if (courseCollapseElem.childElementCount > 0) {
            const profDetailsElem = traverseChildren(courseCollapseElem, [0, 0, 1, 0, 2])
            if (profDetailsElem.getElementsByClassName("spp-stars").length < 1) {
                if (!profData) {
                    profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
                }
                // Create the stars
                let stars2 = null;
                if (profData.course.data) {
                    stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty, profData.course.quality, profData.course.difficulty);
                } else {
                    stars2 = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty);
                }
                profDetailsElem.appendChild(stars2)
            }
        }
    })
}

function updateSBSchedules(doc) {
    // Check to make sure the dialogue box is open
    const dialogueElems = doc.getElementsByClassName("cx-MuiDialog-container")
    if (dialogueElems.length > 0) {
        // Get the name of the course
        const courseNameElem = dialogueElems[0].getElementsByTagName("h1")[0]
        const courseName = courseNameElem.innerText;
        const courseNameParsed = parseCourseName(courseName)

        let instructorLabelElems = [];
        for (let elem of dialogueElems[0].getElementsByTagName("dt")) {
            if (elem.innerText.includes("Instructor")) {
                instructorLabelElems.push(elem);
            }
        }
        // Checking to make sure we got the elements
        if (instructorLabelElems.length == 0) {
            return
        }
        instructorLabelElems.forEach(elem => {
            const profElem = elem.parentNode.childNodes[1]
            const profName = profElem.innerText
            const profNameParsed = parseProfessorName(profName)

            const profData = getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])

            let starElem = null;
            if (profData.course.data) {
                starElem = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty, profData.course.quality, profData.course.difficulty);
            } else {
                starElem = createDetailedStarElement(doc, profData.id, profData.overall.quality, profData.overall.difficulty);
            }

            const externalDiv = doc.createElement("div")
            
            // Replace the child with the external div
            profElem.parentElement.replaceChild(externalDiv, profElem)
            profElem.className = "";
            profElem.removeAttribute('style');
            profElem.style.marginInlineStart = "0";
            externalDiv.appendChild(profElem)
            externalDiv.appendChild(starElem)
        });
    }
}