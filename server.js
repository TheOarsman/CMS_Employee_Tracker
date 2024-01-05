const inquirer = require("inquirer")
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db',
});

// List of answers for first prompt
const whereToStart = ["View All Employees", "View All Departments", "View All Roles", "Update Employee Role", "Add Employee", "Add Role", "Add Department", "Quit"];

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
                    viewEmployees()
                    break;
                case "Add Employee":
                    addEmployee()
                    break;
                // case "Add Role":
                //     addRole()
                //     break;
                // case "Add Department":
                //     addDepartment()
                //     break;
                // case "Update Employee Role":
                //     updateEmployeeRole()
                //     break;
                // case "Quit":
                //     quitProgram()
                //     break;

                default:
                    break;
            }
        });
}

// Function to see list of all departments
function viewDepartments() {
    connection.query(`SELECT * FROM departments`, (err, results) => {
        console.table(results)
        start()
    })
}

// Function to see list of all roles
function viewRoles() {
    connection.query(`SELECT * FROM roles`, (err, results) => {
        console.table(results)
        start()
    })
}

// Function to see list of all employees
function viewEmployees() {
    connection.query(`SELECT * FROM employees`, (err, results) => {
        console.table(results)
        start()
    })
}

// Function to an an employee to the list of employees

async function addEmployee() {
    const addname = await inquirer.prompt(newName());
    connection.query('SELECT role.id, role.role_title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.role_title),
                message: "What is the employee's role?"
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.role_title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('select * from employees', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: "Who is this employee's manager?"
                }
            ]);
            let manager_Id;
            let managerName;
            if (manager === 'none') {
                manager_Id = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        manager_Id = data.id;
                        managerName = data.fullName;
                        console.log(manager_Id);
                        console.log(managerName);
                        continue;
                    }
                }
            }

            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(manager_Id)
                },
                (err, res) => {
                    if (err) throw err;
                    console.log('Employee has been added. Please view all employee to verify...');    
                    prompt();

                }
            );
            
        });
    });

}



// Function to add a role to the list of roles

// function remove(input) {
//     const promptQ = {
//         yes: "yes",
//         no: "no I don't (view all employees on the main option)"
//     };
//     inquirer.prompt([
//         {
//             name: "action",
//             type: "list",
//             message: "In order to proceed an employee, an ID must be entered. View all employees to get the employee ID. Do you know the employee ID?",
//             choices: [promptQ.yes, promptQ.no]
//         }
//     ]).then(answer => {
//         if (input === 'delete' && answer.action === "yes") removeEmployee();
//         else if (input === 'role' && answer.action === "yes") updateRole();
//         else viewAllEmployees();

//         start()
//     });
// };



// Function to add a new department to the list of all departments

// function addDepartment() {
//     connection.query(`select * from employees`, (err, results) => {
//         console.table(results)
//         start()
//     })
// }


// Function to update an Employee's role to the list of roles

// function updateEmployeeRole() {
//     connection.query(`select * from employees`, (err, results) => {
//         console.table(results)
//         start()
//     })
// }


// Function to quit running the program

// function quitProgram() {
//     connection.query(`select * from employees`, (err, results) => {
//         console.table(results)
//         start()
//     })
// }





// Function to ask for employee name when adding a new employee to the employee list

function newName() {
    return ([
        {
            name: "firstName",
            type: "input",
            message: "Enter new employee's first name"
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter new employee's last name"
        }
    ]);
}

start()