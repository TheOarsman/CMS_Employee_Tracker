const inquirer = require('inquirer')
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db',
});

// List of answers for first prompt
const whereToStart = ["View All Employees", "View All Departments", "View All Roles", "Update Employee Role", "Add Employee", "Add Role", "Add Department", "Quit"];

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
                case "Add Role":
                    addRole()
                    break;
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
    connection.query(`SELECT * FROM departments`, (_err, results) => {
        console.table(results)
        start()
    })
}

// Function to see list of all roles
function viewRoles() {
    connection.query(`SELECT * FROM roles`, (_err, results) => {
        console.table(results)
        start()
    })
}

// Function to see list of all employees
function viewEmployees() {
    connection.query(`SELECT * FROM employees`, (_err, results) => {
        console.table(results)
        start()
    })
}

// Function to add an employee to the list of employees

async function addEmployee() {
    const addname = await inquirer.prompt(newName());
    connection.query('SELECT roles.id, roles.role_title FROM roles ORDER BY roles.id;', async (err, res) => {
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
            if (manager === null) {
                manager_Id = 'none';
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
                'INSERT INTO employees SET ?',
                {
                    first_name: addname.firstName,
                    last_name: addname.lastName,
                    role_id: roleId,
                }

            );
        });
        start()
    });
}

// Function to add a role to the list of roles

function addRoleQs(role_title, salary, department_id) {

    connection.query("INSERT INTO roles (role_title, salary, department_id) VALUES (?, ?, (SELECT id FROM departments WHERE department_name = ?));", [role_title, Number(salary), department_id], function (err, results) {
        console.log(results);
        console.log("This new role has been successfully added to the database!");
        start.start();
    })
}

async function addRole() {
    const newRole = await inquirer.prompt(addRoleQs());
    connection.query('SELECT department_name FROM departments',function (err, results) {
        departmentsArr.length = 0;
        for (const departments in results) {
            if (departmentsArr.indexOf(results[departments].department_name) === -1) {
                departmentsArr.push(results[departments].department_name);
            }
        }
    })
    inquirer.prompt(addRoleQs)
        .then((response) => {
            addRoleQs(response.aRole, response.nsalary, response.aTdepartment);
        });
}




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





// Function to ask for employee name when adding a new employee to the Employee list

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

// Fuction to ask when adding a new role to the Roles list

function addRoleQs() {
    return ([
        {
            name: "aRole",
            type: "input",
            message: "Enter name of the new role"
        },
        {
            name: "nSalary",
            type: "input",
            message: "Enter salary of new role (must be numeric)",
        },
        {
            type: 'list',
            name: 'aTdepartment',
            message: 'Which department does the role belong to?',
            choices: connection.query('SELECT department_name FROM departments')
        }
    ]);
}

start()