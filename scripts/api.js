// API functions

/**
 * Looks up the stored ID information for a professor
 * @param {String} firstName 
 * @param {String} lastName 
 * @returns The data stored about the professor
 */
function lookUpProfessorStoredData(firstName, lastName) {
    const name = lastName.toLowerCase() + "-" + firstName.toLowerCase()

    let profData = [];

    PROFESSOR_DATA.forEach(prof => {
        if (prof.nameString == name) {
            profData.push(prof)
        }
    });

    if (profData.length == 0) {
        return null
    } else if (profData.length == 1) {
        return profData[0]
    } else {
        return profData
    }
}

/**
 * Makes a GraphQL request through a CORS proxy
 * @param {String} proxy The URL for the CORS proxy
 * @param {String} url The URL for the GraphQL endpoint
 * @param {String} username The username for GraphQL auth
 * @param {String} password The password for GraphQL auth
 * @param {String} query The GraphQL query
 * @param {Object} variables The GraphQL variables
 * @returns {Object | null} The response of the server or null if failed
 */
async function makeProxiedGraphQLQuery(proxy, url, username, password, query, variables) {
    try {
        // Make the request
        const r = await fetch(`${proxy}${url}`, {
            method: "POST",
            body: JSON.stringify({
                query: query,
                variables: variables
            }),
            headers: {
                'Authorization': "Basic " + btoa(username + ":" + password)
            }
        })
        // Return the response 
        return (await r.json())
    } catch (e) {
        return null
    }
}

/**
 * Parses the name of a course from an RMP review
 * @param {String} courseName 
 * @returns {Array} The course's name followed by its number/
 */
function parseRMPCourseName(courseName) {
    const m = courseName.match(/([A-Z]+)(\d+)/)
    if (!m) {
        return null
    }
    const courseNameParsed = m[1]
    const courseNumParsed = parseInt(m[2])

    return [courseNameParsed, courseNumParsed]
}

/**
 * Requests professor data from Rate My Professor's API
 * @param {String} proxy 
 * @param {String} url 
 * @param {String} username 
 * @param {String} password 
 * @param {String} id 
 * @returns {Object} Data about the professor and their ratings
 */
async function getRMPData(proxy, url, username, password, id) {
    // Make the graphQL request
    const resp = await makeProxiedGraphQLQuery(proxy, url, username, password, SPP_QUERY_GET_RATINGS, {
        id: id
    })
    if (!resp) {
        return null;
    }
    // Parse the ratings
    const ratings = [];
    let courses = [];
    for (let r of resp.data.node.ratings.edges) {
        const cNameParsed = parseRMPCourseName(r.node.class)
        if (!cNameParsed) {
            continue
        }
        if (!courses.includes(`${cNameParsed[0]}${cNameParsed[1]}`)) {
            courses.push(`${cNameParsed[0]}${cNameParsed[1]}`)
        }
        const rParsed = {
            // I'm not sure which one to use, so I'll just average it
            quality: ((r.node.clarityRating + r.node.helpfulRating) / 2),
            course: {
                name: cNameParsed[0],
                num: cNameParsed[1]
            }
        }
        ratings.push(rParsed)
    }
    return {
        avgRating: resp.data.node.avgRating,
        avgDifficulty: resp.data.node.avgDifficulty,
        ratings: ratings,
        courses: courses
    }
}

/**
 * Retrieves information about the professor and course from RMP
 * CURRENTLY A STAND-IN
 * @param {String} firstName The professor's first name
 * @param {String} lastName The professor's last name
 * @param {String} courseName The course's name (ex. CS or MUSIC)
 * @param {Number} courseNum The course's number (ex. 441 or 1443)
 * @returns {Object} Information about the overall and course ratings
 */
async function getProfessorData(firstName, lastName, courseName, courseNum) {
    // Check if we need to load in the data and download accordingly
    
    console.log("REQUEST: ", firstName, lastName, courseName, courseNum)
    /*
    if (Math.random() > 0.5) {
        return null
    }
    */
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