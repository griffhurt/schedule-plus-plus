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

    return profData
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
            difficulty: r.node.difficultyRating,
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
 * Adds a caching system on getRMPData so responses are quicker
 * @param {String} id The ID of the professor
 * @param {*} proxy The URL of the CORS proxy
 * @param {*} url The URL of RMP's GraphQL API
 * @param {*} username The username for the API
 * @param {*} password The password for the API
 * @returns {Object | null} Data about the professor or null on error
 */
async function getRMPDataCached(id, proxy, url, username, password) {
    // Check to see if we've previously cached the professor
    let cacheResult = localStorage.getItem(`spp-${id}`)
    if (cacheResult) {
        // If so, parse the cache
        cacheResult = JSON.parse(cacheResult)
        // Make sure it's not expired
        if (cacheResult.expires > Date.now()) {
            return cacheResult.data
        } else {
            // If expired, refresh
            const dat = await getRMPData(proxy, url, username, password, id)
            if (!dat) {
                return null
            }
            const dat_cache = {
                data: dat,
                expires: (Date.now() + 86400000)
            }
            localStorage.setItem(`spp-${id}`, JSON.stringify(dat_cache))
            return dat
        }
    } else {
        // Get the data from RMP, cache it, and return it
        const dat = await getRMPData(proxy, url, username, password, id)
        if (!dat) {
            return null
        }
        const dat_cache = {
            data: dat,
            expires: (Date.now() + 86400000)
        }
        localStorage.setItem(`spp-${id}`, JSON.stringify(dat_cache))
        return dat
    }
}

/**
 * Gets averages for a course from professor data
 * @param {Object[]} ratingData The ratings obtained from RMP
 * @param {String} courseName The name of the course
 * @param {Number} courseNum The number of the course
 * @returns {Number[]} Average quality followed by average difficulty
 */
function getCourseAverages(ratingData, courseName, courseNum) {
    let courseRatings = [];
    for (let r of ratingData) {
        if (r.course.name == courseName && r.course.num == courseNum) {
            courseRatings.push(r)
        }
    }
    if (courseRatings.length < 5) {
        return null
    }
    let qualitySum = 0.0;
    let difficultySum = 0.0;
    for (let r of courseRatings) {
        qualitySum += r.quality
        difficultySum += r.difficulty
    }
    const qualityAvg = qualitySum / courseRatings.length;
    const difficultyAvg = difficultySum / courseRatings.length;

    return [qualityAvg, difficultyAvg]
}

/**
 * Retrieves information about the professor and course from RMP
 * @param {String} firstName The professor's first name
 * @param {String} lastName The professor's last name
 * @param {String} courseName The course's name (ex. CS or MUSIC)
 * @param {Number} courseNum The course's number (ex. 441 or 1443)
 * @param {String} [proxy] The URL of the CORS proxy to use
 * @param {String} [url] The URL of RMP's GraphQL API
 * @param {String} [username] The username for RMP's API
 * @param {String} [password] The password for RMP's API
 * @returns {Object} Information about the overall and course ratings
 */
async function getProfessorData(firstName, lastName, courseName, courseNum, proxy=SPP_CORS_PROXY, url=SPP_GRAPHQL_LINK, username=SPP_USERNAME, password=SPP_PASSWORD) {
    console.log("REQUEST: ", firstName, lastName, courseName, courseNum)
    
    // Look up the professor in the local db
    const prof_stored = lookUpProfessorStoredData(firstName, lastName)
    // Check if we got lucky with a single prof
    if (prof_stored.length == 1) {
        const prof_id = prof_stored[0].id
        // Get the data about the professor
        const prof_data = await getRMPDataCached(prof_id, proxy, url, username, password)
        if (!prof_data) {
            return null;
        }
        let toReturn = {
            id: prof_stored[0].legacyId,
            overall: {
                difficulty: prof_data.avgDifficulty,
                quality: prof_data.avgRating
            },
            course: {
                data: false
            }
        }
        // See if there's course data
        const courseAvgs = getCourseAverages(prof_data.ratings, courseName, courseNum)
        if (courseAvgs) {
            toReturn.course.data = true
            toReturn.course.quality = courseAvgs[0]
            toReturn.course.difficulty = courseAvgs[1]
        }
        return toReturn
    } else {
        return null
    }
}