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