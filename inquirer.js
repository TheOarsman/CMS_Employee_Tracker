const inquirer = require("inquirer")
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db'
});

// List of answers for first prompt
const whereToStart = ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"];

const roleToDepartment = ["Brewing", "Engineering", "Executive", "Fermentation", "Human Resources", "Innovation", "IT", "Lab", "Logistics", "Maintenance", "Packaging", "Sales", "Sustainability"];

const employeeRoles = ["Brewer", "Brewing Manager", "Programmer", "Lead Engineer", "Innovation Brewer", "Innovation Manager", "Cellarman", "Cellar Manager", "Director of HR", "Training Specialist", "Recruiter", "Sr. HR Business Partner", "IT Manager", "Enterprise Applications", "IT Specialist", "Lab Technician", "Quality Manager", "Logistics Manager", "Logistics AX Coordinator", "Logistics Operator", "Maintenance Manager", "Parts Coordinator", "Maintenance Technician", "Director of Operations", "Production Manager", "Logistics Director", "Brewmaster", "Sales Manager", "Sales Rep", "Packaging Trainer", "Packaging QA Supervisor", "Packaging Manager", "Packaging Supervisor", "Sustainability Specialist", "Sustainability Professional, PhD", "Sustainability Associate", "Environmental Engineer"];

const departmentManagers = ["Rik Delinger", "Chris Donalds", "Louwrens Wildschut", "Stephen Kimble", "Carrie Overton", "Pat Rolfe", "Loren Torrez", "Mike Simon", "Dan Houston", "John Mallet", "Tina Anderson", "Perry Dickerson", "Walker Modic"];

// Starting Prompt, asking what user would like to do
function start() {
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
            switch (answer.getting_started) {
                case "View All Departments":
                    viewDepartments()
                    break;
                case "View All Roles":
                    viewRoles()
                    break;
                case "View All Employees":
                    viewEmplyees()
                    break;
                case "Add Employee":
                    addEmployee()
                    break;
                case "Add Role":
                    addRole()
                    break;
                case "Add Department":
                    addDepartment()
                    break;
                case "Update Employee Role":
                    updateEmployeeRole()
                    break;
                case "Quit":
                    quitProgram()
                    break;

                default:
                    break;
            }
        });
}

// Function to see list of all departments
function viewDepartments() {
    connection.query(`select * from departments`, (err, results) => {
        console.table(results)
        start()
    })
}

// Function to see list of all roles
function viewRoles() {
    connection.query(`select * from roles`, (err, results) => {
        console.table(results)
        start()
    })
}

// Function to see list of all employees
function viewEmplyees() {
    connection.query(`select * from employees`, (err, results) => {
        console.table(results)
        start()
    })
}


// Function to an an employee to the list of employees

// function addEmploye() {
//     connection.query(`select * from employees`, (err, results) => {
//         console.table(results)
//         start()
//     })
// }


// Function to add a role to the list of roles

function addRole() {
    connection.query(`select * from roles`, (err, results) => {
        if (err) throw (err);
    inquirer
        .prompt([{
            name: "role_title",
            type: "input",
            message: "What is the title of the new role?",
          }, 
          {
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?",
          },
          {
            name: "department_name",
            type: "list",
            message: "Which department does this role fall under?",
            choices: function() {
                var choicesArray = [];
                res.forEach(res => {
                    choicesArray.push(
                        res.name
                    );
                })
                return choicesArray;
              }
          }
          ])
        start()
    })
}


// Function to add a new department to the list of all departments

// function addDepartment() {
//     connection.query(`select * from employees`, (err, results) => {
//         console.table(results)
//         start()
//     })
// }


// Function to update an Employee's role to the list of roles

function updateEmployeeRole() {
    connection.query(`select * from employees`, (err, results) => {
        console.table(results)
        start()
    })
}


// Function to quit running the program

// function quitProgram() {
//     connection.query(`select * from employees`, (err, results) => {
//         console.table(results)
//         start()
//     })
// }





// prompts.next([
//     {
//         name: "first_name",
//         type: "input",
//         message: "What is the new amployee's first name?",
//     },
//     {
//         name: "last_name",
//         type: "input",
//         message: "What is the new amployee's last name?",
//     },
// ])
//     .then((answer) => {
//         console.log(answer.first_name, answer.last_name);
//     });

// prompts.next({
//     name: "employee_role",
//     type: "list",
//     message: "What is the new employee's role?",
//     choices: employeeRoles,
// })
//     .then((answer) => {
//         console.log(answer.employee_role);
//     });

// prompts.next({
//     name: "employee_manager",
//     type: "list",
//     message: "What is the new employee's role?",
//     choices: departmentManagers,
// })
//     .then((answer) => {
//         console.log(answer.employee_manager);
//     });

// prompts.next({
//     name: "new_department",
//     type: "input",
//     message: "What is the the new department being added?",
// })
//     .then((answer) => {
//         console.log(answer.new_department);
//     });

// prompts.next({
//     name: "new_role",
//     type: "input",
//     message: "What is the title of the new role being added?",
// })
//     .then((answer) => {
//         console.log(answer.new_role);
//     });

// prompts.next({
//     name: "new_salary",
//     type: "number",
//     message: "What is the salary of the new role?",
// })
//     .then((answer) => {
//         console.log(answer.new_salary);
//     });

// prompts.next({
//     name: "role_deparment",
//     type: "list",
//     message: "What department does new role belong to?",
//     choices: roleToDepartment,
// })
//     .then((answer) => {
//         console.log(answer.role_department);
//     });

// prompts.complete();
start()