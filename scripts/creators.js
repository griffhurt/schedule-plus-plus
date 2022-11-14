// HTML Element Creation 

/**
 * Creates an HTML element with the stars and text stating how many stars
 * @param {Document} doc The document of the page
 * @param {Number} stars The number of stars to show in the element
 * @param {Boolean} [difficulty] Whether this is difficulty stars and the color should be reversed
 * @returns {Node} The crafted stars element
 */
function createStarElement(doc, stars, difficulty=false) {
    const mainDiv = doc.createElement("div");
    // Configure flex
    mainDiv.style.display = "flex";
    mainDiv.style.alignItems = "center";
    // For the number of whole number stars
    for (let i = 0; i < Math.floor(stars); i++) {
        const s = doc.createElement("div")
        s.innerText = "★";
        if (difficulty) {
            if (stars > 2.5) {
                s.style.color = "#e01a04";
            } else {
                s.style.color = "#003594";
            }
        } else {
            if (stars > 2.5) {
                s.style.color = "#003594";
            } else {
                s.style.color = "#e01a04";
            }
        }
        mainDiv.appendChild(s);
    }
    // Add the partial star
    const percent = Math.round((stars - Math.floor(stars)) * 100);
    if (percent > 0) {
        const partialStar = doc.createElement("div")
        if (difficulty) {
            if (stars > 2.5) {
                partialStar.style.cssText = `background: linear-gradient(to right, rgba(224,26,4,1) ${percent}%, rgba(224,26,4,0) ${percent}%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
            } else {
                partialStar.style.cssText = `background: linear-gradient(to right, rgba(0,53,148,1) ${percent}%, rgba(0,53,148,0) ${percent}%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
            }
        } else {
            if (stars > 2.5) {
                partialStar.style.cssText = `background: linear-gradient(to right, rgba(0,53,148,1) ${percent}%, rgba(0,53,148,0) ${percent}%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
            } else {
                partialStar.style.cssText = `background: linear-gradient(to right, rgba(224,26,4,1) ${percent}%, rgba(224,26,4,0) ${percent}%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
            }
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
        const classDifficultyElem = createStarElement(doc, classDifficulty, true)
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
    const overallDifficultyElem = createStarElement(doc, overallDifficulty, true)
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

/**
 * Creates a blank element with spp-stars class so that server doesn't keep rendering
 * @param {Document} doc 
 * @returns A blank element with class spp-stars
 */
function starBlankOut(doc) {
    const mainDiv = doc.createElement("div")
    mainDiv.classList.add("spp-stars")
    mainDiv.style.display = 'none';
    return mainDiv
}