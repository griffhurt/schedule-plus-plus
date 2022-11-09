const d = document.getElementById("main_iframe").contentWindow.document;

// Identify page name
function getPageName(doc) {
    const headerObjs = doc.getElementsByTagName("h1")
    for (let i = 0; i < headerObjs.length; i++) {
        if (headerObjs[i].innerText.includes("Current page")) {
            return headerObjs[i].innerText.split("\n")[1]
        }
    }
}

//background: linear-gradient(to right, rgba(0,0,0,1) Percent%, rgba(0,0,0,0) Percent%);

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

function createStarElement(doc, stars, professorId) {
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

    const mainLink = doc.createElement("a")
    mainLink.style.all = "unset"
    mainLink.href = `https://www.ratemyprofessors.com/professor?tid=${professorId}`
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
            const stars = createStarElement(doc, numStars, 9342);
            profElem.appendChild(stars)
        }

        // Get expanded box
        const expanded = nthParent(elem, 3).getElementsByClassName("cx-MuiGrid-root css-f5ek5k p-3 m-0 position-relative h-100 w-100  cx-MuiGrid-container cx-MuiGrid-align-content-xs-flex-start")
        Array.from(expanded).forEach(elem => {
            if (traverseChildren(elem, [0]).innerText.toLowerCase() == "details") {
                const profElem2 = traverseChildren(elem, [2])
                if (profElem2.getElementsByClassName("spp-stars").length < 1) {
                    const numStars = getProfessorStars(profName, courseName)
                    const stars2 = createStarElement(doc, numStars, 9342);
                    profElem2.appendChild(stars2)
                }
            }
        })
    })
}