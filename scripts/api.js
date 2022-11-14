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