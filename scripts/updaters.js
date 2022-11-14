// Page Updater Functions

/**
 * Updates the professors with stars on the schedule page
 * @param {Document} doc The document of the page
 */
 async function updateScheduleProfessors(doc) {
    for (let elem of doc.querySelectorAll('[id$="-summary"]')) {
        const courseElem = traverseChildren(elem, [0, 0, 0, 0])
        const profElem = traverseChildren(elem, [0, 0, 0, 2, 0, 0, 0])

        const courseName = traverseChildren(courseElem, [0, 0, 0]).innerText;
        const courseNameParsed = parseCourseName(courseName)
        const profName = profElem.innerText;
        const profNameParsed = parseProfessorName(profName)
        
        // Die out if we can't get the prof's name or the course name
        if (!profNameParsed || !courseNameParsed) {
            continue
        }

        // Holder for professor data
        let profData = null;

        if (profElem.getElementsByClassName("spp-stars").length < 1) {
            profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            // Error in request
            if (!profData) {
                profElem.appendChild(starBlankOut(doc))
                continue
            }
            const stars = createStarElement(doc, profData.overall.quality);
            profElem.appendChild(stars)
        }

        // Get expanded box
        const expanded = nthParent(elem, 3).getElementsByClassName("cx-MuiGrid-root css-f5ek5k p-3 m-0 position-relative h-100 w-100  cx-MuiGrid-container cx-MuiGrid-align-content-xs-flex-start")
        for (let elem2 of expanded) {
            if (traverseChildren(elem2, [0]).innerText.toLowerCase() == "details") {
                const profElem2 = traverseChildren(elem2, [2])
                if (profElem2.getElementsByClassName("spp-stars").length < 1) {
                    // Holder variable for stars2
                    let stars2 = null;
                    // Check if we have the prof data yet
                    if (!profData) {
                        profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
                        if (!profData) {
                            profElem2.appendChild(starBlankOut(doc))
                            continue
                        }
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
        }
    }
}

/**
 * Updates professors with stars on pages in the course catalog
 * @param {Document} doc The document of the page
 * @param {String} courseName The name of the course
 * @param {Number} courseNum The number of the course
 */
async function updateCourseCatalogProfessors(doc, courseName, courseNum) {
    for (let elem of doc.querySelectorAll('[id$="-summary"]')) {
        const professorElem = traverseChildren(elem, [0, 6, 0, 0 ]);
        const profName = professorElem.innerText;
        const profNameParsed = parseProfessorName(profName)
        
        // Ensure we can parse the prof's name
        if (!profNameParsed) {
            continue
        }

        // Holder for prof data
        let profData = null;

        if (professorElem.getElementsByClassName("spp-stars").length < 1) {
            profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseName, courseNum)
            if (!profData) {
                professorElem.appendChild(starBlankOut(doc))
                continue
            }
            const starElem = createStarElement(doc, profData.overall.quality);
            professorElem.appendChild(starElem);
        }

        const infoBlocks = nthParent(professorElem, 7).getElementsByTagName("dl");
        for (let elem2 of infoBlocks) {
            if (elem2.innerText.includes("Instructor:")) {
                const profDetailed = traverseChildren(elem2, [0, 0, 1])
                if (profDetailed.getElementsByClassName("spp-stars").length < 1) {
                    if (!profData) {
                        profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseName, courseNum)
                        if (!profData) {
                            profDetailed.appendChild(starBlankOut(doc))
                            continue
                        }
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
        }
    }
}

/**
 * Updates the professors with stars on the course search page
 * @param {Document} doc The page's document
 */
async function updateCourseSearchProfessors(doc) {
    // Get the name of the 
    const h2Elem = doc.getElementsByTagName("h2")[0]
    const h2SpanElem = h2Elem.getElementsByTagName("span")[0]
    const courseNameParsed = parseCourseName(h2SpanElem.innerText.slice(3))

    // Die out if course name not parsed correctly
    if (!courseNameParsed) {
        return
    }

    for (let elem of doc.querySelectorAll('[id$="-summary"]')) {
        const professorElem = traverseChildren(elem, [0, 1, 0, 3, 0, 0, 0, 4]);

        const profName = professorElem.innerText
        const profNameParsed = parseProfessorName(profName)

        // Die out if professor name not parsed
        if (!profNameParsed) {
            continue
        }
        
        // Holder variable for professor data
        let profData = null;

        if (professorElem.getElementsByClassName("spp-stars").length < 1) {
            profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            if (!profData) {
                professorElem.appendChild(starBlankOut(doc))
                continue
            }

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
                    profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])   
                    if (!profData) {
                        profDetailsElem.appendChild(starBlankOut(doc))
                        continue
                    }
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
    }
}

/**
 * Updates the professors with stars on the shopping cart page
 * @param {Document} doc 
 */
async function updateShoppingCart(doc) {
    for (let elem of doc.querySelectorAll('[id$="-summary"]')) {
        const professorElem = traverseChildren(elem, [0, 3, 0, 3])
        
        const profName = professorElem.innerText
        const profNameParsed = parseProfessorName(profName)

        const courseElem = traverseChildren(elem, [0, 1, 0, 0, 0])
        const courseName = courseElem.innerText
        const courseNameParsed = parseCourseName(courseName)

        // Holder variable for professor data
        let profData = null;

        if (professorElem.getElementsByClassName("spp-stars").length < 1) {
            profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            if (!profData) {
                professorElem.appendChild(starBlankOut(doc))
                continue
            }
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
                    profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
                    if (!profData) {
                        detailedInstructorElem.appendChild(starBlankOut(doc))
                        return
                    }
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
    }
}

/**
 * Updates professors with stars on the edit enrollment page
 * @param {Document} doc 
 */
async function updateEditEnrollment(doc) {
    const hrElem = doc.getElementsByTagName("hr")[0]
    const overallElem = nthParent(hrElem, 2)

    for (let elem of Array.from(overallElem.childNodes).slice(2)) {
        const rowElem = traverseChildren(elem, [0, 0, 0])

        const profElem = traverseChildren(rowElem, [2, 0, 3])
        const profName = profElem.innerText
        const profNameParsed = parseProfessorName(profName)

        const courseElem = traverseChildren(rowElem, [0, 0])
        const courseName = courseElem.innerText
        const courseNameParsed = parseCourseName(courseName)

        if (profElem.getElementsByClassName("spp-stars").length < 1) {
            const profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            if (!profData) {
                profElem.appendChild(starBlankOut(doc))
                continue
            }
            
            const starElem = createStarElement(doc, profData.overall.quality);
            const externalDiv = doc.createElement("div")
            
            // Replace the child with the external div
            profElem.parentElement.replaceChild(externalDiv, profElem)
            profElem.className = "";
            profElem.removeAttribute('style');
            externalDiv.appendChild(profElem)
            externalDiv.appendChild(starElem)
        }
    }
}

/**
 * Updates professors with stars on the drop classes page
 * @param {Document} doc 
 */
async function updateDropClasses(doc) {
    for (let elem of doc.querySelectorAll('[id$="-summary"]')) {
        const profElem = traverseChildren(elem, [0, 2, 0, 4])
        const profName = profElem.innerText
        const profNameParsed = parseProfessorName(profName)

        const courseElem = traverseChildren(elem, [0, 0])
        const courseName = courseElem.innerText
        const courseNameParsed = parseCourseName(courseName)

        if (!profNameParsed | !courseNameParsed) {
            continue
        }

        let profData = null;

        if (profElem.getElementsByClassName("spp-stars").length < 1) {
            profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            if (!profData) {
                profElem.appendChild(starBlankOut(doc))
                continue
            }

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
                continue
            }
        }

        if (detailsLabelElem) {
            const detailsElem = nthParent(detailsLabelElem, 2)
            const detailedInstructorElem = traverseChildren(detailsElem, [2])
            if (detailedInstructorElem.getElementsByClassName("spp-stars").length < 1) {
                if (!profData) {
                    profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
                    if (!profData) {
                        detailedInstructorElem.appendChild(starBlankOut(doc))
                        continue
                    }
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
    }
}

/**
 * Updates professors with stars on the schedule builder select sections page
 * @param {Document} doc 
 */
async function updateSBSelectSections(doc) {
    // Get the header
    const headerElem = doc.getElementsByTagName("h2")[0]
    const courseName = headerElem.innerText.split(" -")[0]
    const courseNameParsed = parseCourseName(courseName)

    if (!courseNameParsed) {
        return
    }

    // Find the horizontal break on the page
    const hrElem = doc.getElementsByTagName("hr")[0]
    const sectionsListElem = nthParent(hrElem, 4)
    // Get the courses
    const coursesElem = traverseChildren(sectionsListElem, [1, 0])

    for (let elem of coursesElem.childNodes) {
        const profElem = traverseChildren(elem, [0, 0, 0, 0, 5, 0, 0])
        const profName = profElem.innerText
        const profNameParsed = parseProfessorName(profName)

        if (!profNameParsed) {
            continue
        }
        
        // Holder variable for professor data
        let profData = null;
        
        if (profElem.getElementsByClassName("spp-stars").length < 1) {
            profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
            if (!profData) {
                profElem.appendChild(starBlankOut(doc))
                continue
            }

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
                    profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
                    if (!profData) {
                        profDetailsElem.appendChild(starBlankOut(doc))
                        continue
                    }
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
    }
}

/**
 * Updates professors with stars on the schedule builder schedule and favorites page
 * @param {Document} doc 
 */
async function updateSBSchedules(doc) {
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

        for (let elem of instructorLabelElems) {
            const profElem = elem.parentNode.childNodes[1]
            const profName = profElem.innerText
            const profNameParsed = parseProfessorName(profName)

            if (profElem.getElementsByClassName("spp-stars").length < 1) {
                const profData = await getProfessorData(profNameParsed[0], profNameParsed[1], courseNameParsed[0], courseNameParsed[1])
                if (!profData) {
                    profElem.appendChild(starBlankOut(doc))
                    continue
                }

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
            }
        }
    }
}