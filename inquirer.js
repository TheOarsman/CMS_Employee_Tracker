const inquirer = require("inquirer")

const whereToStart = ["View All Employee", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "View All Managers", "Add Manager", "Quit"];

const roleToDepartment = ["Brewing", "Engineering", "Executive", "Fermentation", "Human Resources", "Innovation", "IT", "Lab", "Logistics", "Maintenance", "Packaging", "Sales", "Sustainability"];

const employeeRoles = ["Brewer", "Brewing Manager", "Programmer", "Lead Engineer", "Innovation Brewer", "Innovation Manager", "Cellarman", "Cellar Manager", "Director of HR", "Training Specialist", "Recruiter", "Sr. HR Business Partner", "IT Manager", "Enterprise Applications", "IT Specialist", "Lab Technician", "Quality Manager", "Logistics Manager", "Logistics AX Coordinator", "Logistics Operator", "Maintenance Manager", "Parts Coordinator", "Maintenance Technician", "Director of Operations", "Production Manager", "Logistics Director", "Brewmaster", "Sales Manager", "Sales Rep", "Packaging Trainer", "Packaging QA Supervisor", "Packaging Manager", "Packaging Supervisor", "Sustainability Specialist", "Sustainability Professional, PhD", "Sustainability Associate", "Environmental Engineer"];

const departmentManagers = ["Rik Delinger", "Chris Donalds", "Louwrens Wildschut", "Stephen Kimble", "Carrie Overton", "Pat Rolfe", "Loren Torrez", "Mike Simon", "Dan Houston", "John Mallet", "Tina Anderson", "Perry Dickerson", "Walker Modic"];

inquirer
    .prompt([
        {
            name: "getting_started",
            type: "list",
            message: "What would you like to do?",
            choices: whereToStart,
        },
    ])
    .then((answer) => {
        console.log(answer.getting_started);
    });

prompts.next([
    {
        name: "first_name",
        type: "input",
        message: "What is the new amployee's first name?",
    },
    {
        name: "last_name",
        type: "input",
        message: "What is the new amployee's last name?",
    },
])
    .then((answer) => {
        console.log(answer.first_name, answer.last_name);
    });

prompts.next({
    name: "employee_role",
    type: "list",
    message: "What is the new employee's role?",
    choices: employeeRoles,
})
    .then((answer) => {
        console.log(answer.employee_role);
    });

prompts.next({
    name: "employee_manager",
    type: "list",
    message: "What is the new employee's role?",
    choices: departmentManagers,
})
    .then((answer) => {
        console.log(answer.employee_manager);
    });

prompts.next({
    name: "new_department",
    type: "input",
    message: "What is the the new department being added?",
})
    .then((answer) => {
        console.log(answer.new_department);
    });

prompts.next({
    name: "new_role",
    type: "input",
    message: "What is the title of the new role being added?",
})
    .then((answer) => {
        console.log(answer.new_role);
    });

prompts.next({
    name: "new_salary",
    type: "number",
    message: "What is the salary of the new role?",
})
    .then((answer) => {
        console.log(answer.new_salary);
    });

prompts.next({
    name: "role_deparment",
    type: "list",
    message: "What department does new role belong to?",
    choices: roleToDepartment,
})
    .then((answer) => {
        console.log(answer.role_department);
    });

prompts.complete();
