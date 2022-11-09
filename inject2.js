window.setInterval(() => {
    try {
        const ifr = document.getElementById("main_iframe")
        const d = ifr.contentWindow.document;
        if (getPageName(d) === "Schedule") {
            updateScheduleProfessors(d)
        }
    } finally {
        ;
    }
}, 500)

// Identify page name
function getPageName(doc) {
    try {
        return /[Cc]urrent [Pp]age\n(.+)\n/g.exec(doc.body.innerText)[1]
    } catch (e) {
        return null
    }
}

function nthParent(elem, n) {
    for (let i = 0; i < n; i++) {
        elem = elem.parentNode;
    }
    return elem;
}

function traverseChildren(elem, childrenList) {
    for (let i = 0; i < childrenList.length; i++) {
        elem = elem.children[childrenList[i]]
    }
    return elem;
}

function createStarElement(doc, stars) {
    const mainDiv = doc.createElement("div");
    // Configure flex
    mainDiv.style.display = "flex";
    mainDiv.style.alignItems = "center";
    // For the number of whole number stars
    for (let i = 0; i < Math.floor(stars); i++) {
        const s = doc.createElement("div")
        s.innerText = "★";
        mainDiv.appendChild(s);
    }
    // Add the partial star
    const percent = Math.round((stars - Math.floor(stars)) * 100);
    if (percent > 0) {
        const partialStar = doc.createElement("div")
        partialStar.style.cssText = `background: linear-gradient(to right, rgba(0,0,0,1) ${percent}%, rgba(0,0,0,0) ${percent}%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
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

function getProfessorStars(profName, className) {
    return 4.6
}

// 
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

