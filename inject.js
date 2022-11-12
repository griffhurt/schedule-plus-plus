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
            const mat = getPageName(d).match(/([A-Z]+) (\d{4}) - (.+)/g)
            const subjectName = mat[1]
            const subjectNumber = mat[2]
            updateCourseCatalogProfessors(d)
        } else if (getPageName(d) === "Class Search") {
            // updateCourseSearchProfessors(d)
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
function getProfessorStars(firstName, lastName, courseName, courseNum) {
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
        s.style.color = "#003594";
        mainDiv.appendChild(s);
    }
    // Add the partial star
    const percent = Math.round((stars - Math.floor(stars)) * 100);
    if (percent > 0) {
        const partialStar = doc.createElement("div")
        partialStar.style.cssText = `background: linear-gradient(to right, rgba(0,53,148,1) ${percent}%, rgba(0,53,148,0) ${percent}%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
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
    const m = /([A-Z]+) (\d{4})/.match(courseName)
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
    // Check for "To be Announced" and "Staff"
    if (profName.toLowerCase() == "to be announced" || profName.toLowerCase() == "staff") {
        return null
    }
    // Match the name of the professor
    const m = profName.split(" ")
    for (let elem of m) {
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
        const profName = profElem.innerText;
        
        if (profElem.getElementsByClassName("spp-stars").length < 1) {
            const numStars = getProfessorStars(profName, courseName)
            const stars = createStarElement(doc, numStars);
            profElem.appendChild(stars)
        }

        // Get expanded box
        const expanded = nthParent(elem, 3).getElementsByClassName("cx-MuiGrid-root css-f5ek5k p-3 m-0 position-relative h-100 w-100  cx-MuiGrid-container cx-MuiGrid-align-content-xs-flex-start")
        Array.from(expanded).forEach(elem => {
            if (traverseChildren(elem, [0]).innerText.toLowerCase() == "details") {
                const profElem2 = traverseChildren(elem, [2])
                if (profElem2.getElementsByClassName("spp-stars").length < 1) {
                    const stars2 = createDetailedStarElement(doc, 0, 4.3, 2.3, 1.2, 5.0);
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
function updateCourseCatalogProfessors(doc) {
    doc.querySelectorAll('[id$="-summary"]').forEach(elem => {
        const professorElem = traverseChildren(elem, [0, 6, 0, 0 ]);
        if (professorElem.getElementsByClassName("spp-stars").length < 1) {
            const starElem = createStarElement(doc, 4.3);
            professorElem.appendChild(starElem);
        }

        const infoBlocks = nthParent(professorElem, 7).getElementsByTagName("dl");
        Array.from(infoBlocks).forEach(elem2 => {
            if (elem2.innerText.includes("Instructor:")) {
                const profDetailed = traverseChildren(elem2, [0, 0, 1])
                if (profDetailed.getElementsByClassName("spp-stars").length < 1) {
                    const stars2 = createDetailedStarElement(doc, 0, 4.3, 2.3, 1.2, 5.0);
                    profDetailed.appendChild(stars2)
                }
            }
        })
    })
}

function updateCourseSearchProfessors(doc) {
    doc.querySelectorAll('[id$="-summary"]').forEach(elem => {
        const professorElem = traverseChildren(elem, [0, 1, 0, 3, 0, 0, 0, 4]);
        if (professorElem.getElementsByClassName("spp-stars").length < 1) {
            const starElem = createStarElement(doc, 4.3);
            const externalDiv = doc.createElement("div")
            // Replace the child with the external div
            professorElem.parentElement.replaceChild(externalDiv, professorElem)
            professorElem.className = "";
            professorElem.removeAttribute('style');
            externalDiv.appendChild(professorElem)
            externalDiv.appendChild(starElem)
        }

        /*
        const infoBlocks = nthParent(professorElem, 7).getElementsByTagName("dl");
        Array.from(infoBlocks).forEach(elem2 => {
            if (elem2.innerText.includes("Instructor:")) {
                const profDetailed = traverseChildren(elem2, [0, 0, 1])
                if (profDetailed.getElementsByClassName("spp-stars").length < 1) {
                    const stars2 = createDetailedStarElement(doc, 0, 4.3, 2.3, 1.2, 5.0);
                    profDetailed.appendChild(stars2)
                }
            }
        })
        */
    })
}