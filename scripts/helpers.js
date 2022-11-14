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