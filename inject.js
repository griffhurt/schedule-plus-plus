/*
To add stars below the professor name, add a div encompassing the instructor tab
with the class "MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12",
remove the class from the internal div, and remove the "width: 0" from the "style"
of the internal div.
*/

const add_stars = (doc, instructor_div, star_count) => {
    // Clone the instructor_div
    let i_clone = instructor_div.cloneNode(true);
    // Create a new div element with the proper settings
    let new_div = doc.createElement("div");
    new_div.setAttribute("class", "MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12")
    // Remove "width: 0" on the internal div
    i_clone.style.width = null;
    
    // Add the clone to the new div
    new_div.appendChild(instructor_div);
    console.log(new_div)
    // Create a new paragraph
    // const para = doc.createElement("p");
    // const node = doc.createTextNode("This is new.");
    // para.appendChild(node);
    // new_div.appendChild(para);
    // Add the new div
    instructor_div.after(i_clone);
    // Remove the original instructor div
    instructor_div.remove();
}

// Load the iframe
const ifr = document.getElementById("main_iframe").contentWindow;

// Get the course blocks
// const course_classes = "MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 MuiGrid-grid-lg-12 MuiGrid-grid-xl-12";

// const course_teachers = "cx-MuiGrid-root cx-MuiGrid-item cx-MuiGrid-grid-xs-12";
// const course_elems = ifr.document.getElementsByClassName(course_teachers);

const classInfo = ifr.document.getElementsByClassName("px-1 px-sm-3 pb-sm-3 px-lg-4 pb-lg-4");
var instructorDictionary = new Object();
console.log(classInfo);
let c = 0;



Array.from(classInfo).forEach(element => {
    console.log("asdfkjgha");
    // Get the actual internal content of the course
    const divName = element.className;
    const classes = [];
    if(divName.includes("cx-MuiTypography-body2")) 
    {
        const courseName = element.children
        if(element.children[0])
        {
            classes.push(element.children[0].innerText.split("\n")[0]);
        }
        
    }
    if(divName.includes("css"))
    {
        // we found the element
        const instructorName = element.children[0].innerText.split("\n")[0];
        console.log(instructorName);
        instructorDictionary[instructorName] = classes[c] // class they teach
        c++;
    }
    
})
console.log(instructorDictionary);

// Loop through the courses
/*
Array.from(course_elems).forEach(element => {
    // Get the actual internal content of the course
    let divName = element.getAttribute("name");
    if(divName.includes("-summary"))
    {
        console.log(element.children);
        aslkdjfhadslkjfh;
        // we found the div with the course shit lmfao
        const course = element.children
        const course_info = course.children[3].children[0].children[0].children[0];
        // Get the professor names
        const prof_names = course_info.children[4].children[0].children[0].textContent;
        const profs = prof_names.split(",\n\r");
        // Filter out dashes and "to be announced"
        let profs_filtered = profs.filter(elem => elem != "-");
        profs_filtered = profs_filtered.filter(elem => elem != "To be Announced");
    }
    // Try to add a new element
    add_stars(ifr.document, course_info.children[4], 0);
    console.log(profs_filtered)
});




// TODO: support for multiple line professors, see CHEM 0330 for Fall semester

// TODO: Filter by class?
*/