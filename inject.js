// Injects the JavaScript files for the extension

const inject = () => {
    let b = (typeof browser === "undefined") ? chrome : browser

    const scripts = [
        // Data
        b.runtime.getURL("data/professorData.js"),
        b.runtime.getURL("data/config.js"),
        // Scripts
        b.runtime.getURL("scripts/creators.js"),
        b.runtime.getURL("scripts/helpers.js"),
        b.runtime.getURL("scripts/updaters.js"),
        b.runtime.getURL("scripts/api.js"),
        b.runtime.getURL("scripts/main.js")
    ]

    const head = document.getElementsByTagName("head")[0]

    scripts.forEach(scrpt => {
        const scriptElem = document.createElement("script")
        scriptElem.src = scrpt
        head.appendChild(scriptElem)
    })
}

inject()